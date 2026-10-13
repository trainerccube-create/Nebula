/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Trophy 
} from 'lucide-react';
import { sound } from './services/audio';

// --- Dimensions & Physics Engine Configurations ---
const CANVAS_WIDTH = 380;
const CANVAS_HEIGHT = 480;
const GRAVITY = 0.5;
const FRICTION = 0.85;
const ACCEL = 0.95;
const MAX_SPEED = 5.2;
const JUMP_FORCE = -11.5;

const START_X = 40;
const START_Y = 400;

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'floor' | 'wall' | 'solid' | 'troll-drop' | 'troll-smasher' | 'moving';
  triggered?: boolean;
  vy?: number;
  targetY?: number;
  startY?: number;
  speed?: number;
  minX?: number;
  maxX?: number;
  direction?: number;
}

interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'lava' | 'hidden-spike';
  revealed?: boolean;
  revealDist?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: number;
  speed: number;
  timer: number;
  hp: number;
  maxHp: number;
  phaseTimer: number;
  state: 'hover' | 'shake' | 'slam' | 'rebound';
  slamVy: number;
  hitFlash: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenOverlayRef = useRef<HTMLDivElement | null>(null);

  // --- UI Reactive States ---
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [attempts, setAttempts] = useState<number>(0);
  const [isBossActive, setIsBossActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  // Controller Visual Feedback States
  const [leftActive, setLeftActive] = useState<boolean>(false);
  const [rightActive, setRightActive] = useState<boolean>(false);
  const [jumpActive, setJumpActive] = useState<boolean>(false);

  // --- Core Engine Persistent Refs ---
  const engineRef = useRef({
    currentLevel: 1,
    attempts: 0,
    shakeFrames: 0,
    isDead: false, // CRITICAL FIX: Track death state to lock multi-collision trigger errors
    keys: { left: false, right: false, up: false },
    player: {
      x: START_X,
      y: START_Y,
      width: 16,
      height: 16,
      vx: 0,
      vy: 0,
      isGrounded: false,
      coyoteTimer: 0,
      jumpBuffer: 0,
      wallContact: 0 as -1 | 1 | 0,
      wallDir: 0 as -1 | 1 | 0,
      wallCoyoteTimer: 0,
      wallJumpLockTimer: 0,
      color: '#22d3ee',
      eyeOffset: 1,
    },
    platforms: [] as Platform[],
    hazards: [] as Hazard[],
    particles: [] as Particle[],
    portal: { x: 330, y: 408, width: 24, height: 32 },
    bossEntity: null as Boss | null,
  });

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // --- Action Trigger Event Processing Hook for Death and Precise Respawn Mechanics ---
  const killPlayer = useCallback(() => {
    const eng = engineRef.current;
    if (eng.isDead) return;
    eng.isDead = true;

    // HARD RESET ALL CONTROLLER INPUTS IMMEDIATELY
    eng.keys.left = false;
    eng.keys.right = false;
    eng.keys.up = false;
    setLeftActive(false);
    setRightActive(false);
    setJumpActive(false);

    eng.attempts++;
    setAttempts(eng.attempts);

    eng.shakeFrames = 15;
    if (screenOverlayRef.current) {
      screenOverlayRef.current.style.backgroundColor = 'rgba(239, 68, 68, 0.6)';
    }

    sound.playExplosion();

    // Spawn 25 particle burst
    for (let i = 0; i < 25; i++) {
      eng.particles.push({
        x: eng.player.x + eng.player.width / 2,
        y: eng.player.y + eng.player.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: Math.random() * 3 + 1,
        color: '#f87171',
        alpha: 1,
      });
    }

    // Reset Player to Safe Start Position & Reset Traps
    setTimeout(() => {
      eng.player.x = START_X;
      eng.player.y = START_Y;
      eng.player.vx = 0;
      eng.player.vy = 0;
      eng.player.isGrounded = false;
      eng.player.coyoteTimer = 0;
      eng.player.jumpBuffer = 0;
      eng.player.wallContact = 0;
      eng.player.wallDir = 0;
      eng.player.wallCoyoteTimer = 0;
      eng.player.wallJumpLockTimer = 0;

      // Reset Level Dynamic Traps
      eng.platforms.forEach((p) => {
        if (p.type === 'troll-drop') {
          p.triggered = false;
          p.vy = 0;
          p.y = p.startY || p.y;
        }
        if (p.type === 'troll-smasher') {
          p.triggered = false;
          p.y = p.startY || -40;
          p.speed = 0;
        }
      });

      eng.hazards.forEach((h) => {
        if (h.type === 'hidden-spike') {
          h.revealed = false;
        }
      });

      if (screenOverlayRef.current) {
        screenOverlayRef.current.style.backgroundColor = 'transparent';
      }

      eng.isDead = false;
    }, 120);
  }, []);

  // --- Dynamic Engine Level Generator Logic Pipeline ---
  const buildLevelData = useCallback((lvl: number) => {
    const eng = engineRef.current;
    eng.platforms = [];
    eng.hazards = [];
    eng.bossEntity = null;

    // Baseline Boundary Walls & Floor Layout Base
    eng.platforms.push({ x: 0, y: 440, width: 380, height: 40, type: 'floor' });
    eng.platforms.push({ x: 0, y: 0, width: 10, height: 480, type: 'wall' });
    eng.platforms.push({ x: 370, y: 0, width: 10, height: 480, type: 'wall' });

    // Universal Standard Portal End Point Destination Coordinate Positioning
    eng.portal.x = 330;
    eng.portal.y = 408;

    // --- BOSS FIGHT ROUTER MATRIX MILIEU ---
    if (lvl === 14 || lvl === 28 || lvl === 42 || lvl === 56 || lvl === 70 || lvl === 84 || lvl === 100) {
      setIsBossActive(true);
      eng.portal.x = -500; // Hide destination offscreen until match complete conditions met

      eng.bossEntity = {
        x: 280,
        y: 100,
        width: 60,
        height: 60,
        direction: 1,
        speed: 2.5,
        timer: 60,
        hp: lvl === 14 ? 3 : 5,
        maxHp: lvl === 14 ? 3 : 5,
        phaseTimer: 0,
        state: 'hover',
        slamVy: 0,
        hitFlash: 0,
      };

      // Construct clean platform battle arena format layout
      eng.platforms.push({ x: 30, y: 300, width: 100, height: 12, type: 'solid' });
      eng.platforms.push({ x: 250, y: 300, width: 100, height: 12, type: 'solid' });
      eng.platforms.push({ x: 130, y: 200, width: 120, height: 12, type: 'solid' });
      // Vertical wall platform in arena to wall-jump and evade boss slams
      eng.platforms.push({ x: 183, y: 150, width: 14, height: 140, type: 'wall' });

      // Floor Spikes in Center Pit to trick the boss into slamming on
      eng.hazards.push({ x: 130, y: 425, width: 120, height: 15, type: 'spike' });
      sound.playAlarm();
      return;
    }

    setIsBossActive(false);

    // --- PROCEDURAL TROLL PROGRESSION GENERATION SYSTEM GRID ---
    if (lvl >= 1 && lvl <= 13) {
      // Intro Arc: Troll platforms that drop out from underneath user on contact
      eng.platforms.push({ x: 100, y: 360, width: 70, height: 12, type: 'troll-drop', triggered: false, vy: 0, startY: 360 });
      eng.platforms.push({ x: 210, y: 290, width: 70, height: 12, type: 'troll-drop', triggered: false, vy: 0, startY: 290 });
      eng.platforms.push({ x: 120, y: 200, width: 80, height: 12, type: 'solid' });

      // Add vertical wall platform on even levels to feature the wall-jump mechanic
      if (lvl % 2 === 0) {
        eng.platforms.push({ x: 183, y: 180, width: 14, height: 150, type: 'wall' });
      }

      // Floor Spike Pit elements array injection mapping placement logic
      eng.hazards.push({ x: 160, y: 425, width: 60, height: 15, type: 'spike' });

      if (lvl >= 6) {
        eng.hazards.push({ x: 290, y: 425, width: 25, height: 15, type: 'hidden-spike', revealed: false, revealDist: 50 });
      }
    } else if (lvl >= 15 && lvl <= 35) {
      // Secondary Stage Complexity Tier: Falling ceiling smashers and hidden trigger blocks
      eng.platforms.push({ x: 90, y: 350, width: 60, height: 12, type: 'solid' });
      eng.platforms.push({ x: 200, y: 350, width: 60, height: 12, type: 'solid' });

      // The Smasher Block trap structure rules logic allocation
      eng.platforms.push({
        x: 150,
        y: -40,
        width: 50,
        height: 40,
        type: 'troll-smasher',
        triggered: false,
        targetY: 400,
        startY: -40,
        speed: 0,
      });

      eng.hazards.push({ x: 150, y: 0, width: 50, height: 10, type: 'lava' });
      eng.hazards.push({ x: 150, y: 425, width: 50, height: 15, type: 'lava' });
    } else {
      // Advanced End Game Challenge Framework Map Configurations Loop
      const seed = (lvl * 9301 + 49297) % 233280;
      const isMoving = seed % 2 === 0;

      if (isMoving) {
        eng.platforms.push({
          x: 100,
          y: 350,
          width: 60,
          height: 12,
          type: 'moving',
          minX: 80,
          maxX: 220,
          speed: 1.8,
          direction: 1,
        });
      } else {
        eng.platforms.push({ x: 80, y: 360, width: 50, height: 12, type: 'solid' });
        eng.platforms.push({ x: 160, y: 280, width: 50, height: 12, type: 'solid' });
        eng.platforms.push({ x: 240, y: 200, width: 50, height: 12, type: 'solid' });
      }

      eng.hazards.push({ x: 130, y: 425, width: 120, height: 15, type: 'spike' });
      eng.hazards.push({ x: 170, y: 265, width: 30, height: 15, type: 'hidden-spike', revealed: false, revealDist: 45 });
    }
  }, []);

  // --- Load Level Handler ---
  const loadLevel = useCallback(
    (lvl: number) => {
      const eng = engineRef.current;
      eng.currentLevel = lvl;
      setCurrentLevel(lvl);
      eng.isDead = false;

      eng.player.x = START_X;
      eng.player.y = START_Y;
      eng.player.vx = 0;
      eng.player.vy = 0;
      eng.player.isGrounded = false;
      eng.player.coyoteTimer = 0;
      eng.player.jumpBuffer = 0;
      eng.player.wallContact = 0;
      eng.player.wallDir = 0;
      eng.player.wallCoyoteTimer = 0;
      eng.player.wallJumpLockTimer = 0;

      buildLevelData(lvl);
      sound.playWarp();
    },
    [buildLevelData]
  );

  // --- Keyboard Event Handlers ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const keys = engineRef.current.keys;

      if (k === 'arrowleft' || k === 'a') {
        e.preventDefault();
        keys.left = true;
        setLeftActive(true);
      }
      if (k === 'arrowright' || k === 'd') {
        e.preventDefault();
        keys.right = true;
        setRightActive(true);
      }
      if (k === 'arrowup' || k === 'w' || e.code === 'Space' || k === ' ') {
        e.preventDefault();
        keys.up = true;
        setJumpActive(true);
        engineRef.current.player.jumpBuffer = 7;
      }
      if (k === 'r') {
        killPlayer();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const keys = engineRef.current.keys;

      if (k === 'arrowleft' || k === 'a') {
        keys.left = false;
        setLeftActive(false);
      }
      if (k === 'arrowright' || k === 'd') {
        keys.right = false;
        setRightActive(false);
      }
      if (k === 'arrowup' || k === 'w' || e.code === 'Space' || k === ' ') {
        keys.up = false;
        setJumpActive(false);
      }
    };

    const handleBlur = () => {
      const keys = engineRef.current.keys;
      keys.left = false;
      keys.right = false;
      keys.up = false;
      setLeftActive(false);
      setRightActive(false);
      setJumpActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [killPlayer]);

  // --- Main 60 FPS Platformer Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    buildLevelData(1);

    let animId: number;

    const gameLoop = () => {
      const eng = engineRef.current;
      const p = eng.player;

      // Only update simulation if alive
      if (!eng.isDead) {
        // Horizontal Movement & Acceleration
        if (p.wallJumpLockTimer > 0) {
          p.wallJumpLockTimer--;
          // Still permit air steering during wall kick arc without cancelling the impulse
          if (p.vx > 0 && eng.keys.left) p.vx -= ACCEL * 0.25;
          else if (p.vx < 0 && eng.keys.right) p.vx += ACCEL * 0.25;
        } else {
          if (eng.keys.left) {
            p.vx -= ACCEL;
            p.eyeOffset = -1;
          } else if (eng.keys.right) {
            p.vx += ACCEL;
            p.eyeOffset = 1;
          } else {
            p.vx *= FRICTION;
          }
          p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
        }

        // Gravity Acceleration
        p.vy = Math.min(13, p.vy + GRAVITY);

        // Coyote Time & Jump Buffering
        if (p.isGrounded) {
          p.coyoteTimer = 7;
        } else if (p.coyoteTimer > 0) {
          p.coyoteTimer--;
        }
        if (p.jumpBuffer > 0) p.jumpBuffer--;

        // Execute Jump: Ground Jump or Wall Jump
        if (p.jumpBuffer > 0 && p.coyoteTimer > 0) {
          p.vy = JUMP_FORCE;
          p.coyoteTimer = 0;
          p.jumpBuffer = 0;
          p.isGrounded = false;
          sound.playLaser();
        } else if (p.jumpBuffer > 0 && !p.isGrounded && p.wallCoyoteTimer > 0) {
          // WALL-JUMP MECHANIC:
          // Pushes the player away in the opposite direction and upward!
          const wallDir = p.wallDir; // -1 for wall on player's left, 1 for wall on player's right
          const pushDir = (-wallDir) as (-1 | 1); // Opposite direction: 1 for right, -1 for left
          p.vx = pushDir * 5.8; // Impulse away from wall
          p.vy = JUMP_FORCE * 0.96; // Upward impulse
          p.jumpBuffer = 0;
          p.wallCoyoteTimer = 0;
          p.wallContact = 0;
          p.coyoteTimer = 0;
          p.wallJumpLockTimer = 8;
          p.eyeOffset = pushDir;
          sound.playLaser();

          // Spawn wall-jump kick spark particles
          const kickX = wallDir === -1 ? p.x : p.x + p.width;
          for (let i = 0; i < 9; i++) {
            eng.particles.push({
              x: kickX,
              y: p.y + p.height / 2 + (Math.random() - 0.5) * 8,
              vx: pushDir * (Math.random() * 2.5 + 1.2),
              vy: (Math.random() - 0.5) * 4 - 1.5,
              radius: Math.random() * 2 + 1,
              color: '#38bdf8',
              alpha: 1,
            });
          }
        }

        // Variable Jump Cut
        if (!eng.keys.up && p.vy < -3.5) {
          p.vy = -3.5;
        }

        // -------------------------------------------------------------
        // DYNAMIC PLATFORMS & TROLL TRAPS UPDATE
        // -------------------------------------------------------------
        eng.platforms.forEach((plat) => {
          if (plat.type === 'moving') {
            plat.x += (plat.speed || 1.5) * (plat.direction || 1);
            if (plat.minX && plat.x <= plat.minX) {
              plat.x = plat.minX;
              plat.direction = 1;
            } else if (plat.maxX && plat.x >= plat.maxX) {
              plat.x = plat.maxX;
              plat.direction = -1;
            }
          }

          if (plat.type === 'troll-drop' && plat.triggered) {
            plat.vy = (plat.vy || 0) + 0.6;
            plat.y += plat.vy;
          }

          if (plat.type === 'troll-smasher') {
            if (!plat.triggered && Math.abs(p.x + p.width / 2 - (plat.x + plat.width / 2)) < 45) {
              plat.triggered = true;
              plat.speed = 1;
              sound.playHit();
            }
            if (plat.triggered) {
              plat.speed = (plat.speed || 1) + 0.8;
              plat.y += plat.speed;
              if (plat.targetY && plat.y >= plat.targetY) {
                plat.y = plat.targetY;
                plat.speed = 0;
              }
            }
          }
        });

        // Hidden Spikes Proximity Trigger
        eng.hazards.forEach((h) => {
          if (h.type === 'hidden-spike' && !h.revealed) {
            const dist = Math.hypot(p.x + p.width / 2 - (h.x + h.width / 2), p.y + p.height / 2 - (h.y + h.height / 2));
            if (dist < (h.revealDist || 50)) {
              h.revealed = true;
              sound.playAlarm();
            }
          }
        });

        // -------------------------------------------------------------
        // BOSS ENTITY AI LOGIC
        // -------------------------------------------------------------
        if (eng.bossEntity) {
          const boss = eng.bossEntity;
          if (boss.hitFlash > 0) boss.hitFlash--;

          if (boss.state === 'hover') {
            const targetX = p.x - boss.width / 2 + p.width / 2;
            boss.x += (targetX - boss.x) * 0.07;
            boss.y = 80 + Math.sin(Date.now() * 0.005) * 10;

            boss.timer--;
            if (boss.timer <= 0) {
              boss.state = 'shake';
              boss.timer = 20;
              sound.playAlarm();
            }
          } else if (boss.state === 'shake') {
            boss.x += (Math.random() - 0.5) * 5;
            boss.timer--;
            if (boss.timer <= 0) {
              boss.state = 'slam';
              boss.slamVy = 15;
            }
          } else if (boss.state === 'slam') {
            boss.y += boss.slamVy;

            // Squashes player?
            if (
              p.x < boss.x + boss.width &&
              p.x + p.width > boss.x &&
              p.y < boss.y + boss.height &&
              p.y + p.height > boss.y
            ) {
              killPlayer();
              return;
            }

            // Impact with ground floor
            if (boss.y >= 380) {
              boss.y = 380;
              eng.shakeFrames = 10;
              sound.playExplosion();

              // Damaged if slammed on center spikes
              const bossCenterX = boss.x + boss.width / 2;
              if (bossCenterX >= 120 && bossCenterX <= 260) {
                boss.hp--;
                boss.hitFlash = 12;
                sound.playHit();

                if (boss.hp <= 0) {
                  // Boss Defeated!
                  eng.bossEntity = null;
                  setIsBossActive(false);
                  eng.portal.x = 330;
                  eng.portal.y = 408;
                  sound.playVictory();
                }
              }

              if (eng.bossEntity) {
                boss.state = 'rebound';
                boss.timer = 25;
              }
            }
          } else if (boss.state === 'rebound') {
            boss.timer--;
            if (boss.timer <= 0) {
              boss.y += (80 - boss.y) * 0.1;
              if (boss.y <= 88) {
                boss.state = 'hover';
                boss.timer = 45;
              }
            }
          }
        }

        // -------------------------------------------------------------
        // AABB COLLISION RESOLUTION (Floors, Walls & Ceilings)
        // -------------------------------------------------------------
        const nextX = p.x + p.vx;
        const nextY = p.y + p.vy;

        p.isGrounded = false;
        let directWallHit: -1 | 1 | 0 = 0;

        // X Movement
        p.x = nextX;
        for (const plat of eng.platforms) {
          if (
            p.x < plat.x + plat.width &&
            p.x + p.width > plat.x &&
            p.y < plat.y + plat.height &&
            p.y + p.height > plat.y
          ) {
            if (p.vx > 0) {
              p.x = plat.x - p.width;
              if (plat.type === 'wall' || plat.height >= plat.width) {
                directWallHit = 1;
              }
            } else if (p.vx < 0) {
              p.x = plat.x + plat.width;
              if (plat.type === 'wall' || plat.height >= plat.width) {
                directWallHit = -1;
              }
            }
            p.vx = 0;
          }
        }

        // Y Movement
        p.y = nextY;
        for (const plat of eng.platforms) {
          if (
            p.x < plat.x + plat.width &&
            p.x + p.width > plat.x &&
            p.y < plat.y + plat.height &&
            p.y + p.height > plat.y
          ) {
            if (p.vy > 0) {
              p.y = plat.y - p.height;
              p.vy = 0;
              p.isGrounded = true;

              if (plat.type === 'troll-drop' && !plat.triggered) {
                plat.triggered = true;
                plat.vy = 0.5;
                sound.playHit();
              }
            } else if (p.vy < 0) {
              p.y = plat.y + plat.height;
              p.vy = 0;
            }
          }
        }

        // Wall Contact Proximity Detection (Vertical 'wall' platforms)
        let touchingWallDir: -1 | 1 | 0 = directWallHit;
        if (touchingWallDir === 0) {
          for (const plat of eng.platforms) {
            if (plat.type === 'wall' || plat.height > plat.width) {
              const verticalOverlap = p.y + p.height > plat.y + 2 && p.y < plat.y + plat.height - 2;
              if (verticalOverlap) {
                if (Math.abs(p.x - (plat.x + plat.width)) <= 3) {
                  touchingWallDir = -1;
                  break;
                } else if (Math.abs((p.x + p.width) - plat.x) <= 3) {
                  touchingWallDir = 1;
                  break;
                }
              }
            }
          }
        }

        if (touchingWallDir !== 0 && !p.isGrounded) {
          p.wallContact = touchingWallDir;
          p.wallDir = touchingWallDir;
          p.wallCoyoteTimer = 8;

          // Wall slide friction: smoothly cap downward sliding speed
          if (p.vy > 3.0) {
            p.vy = 3.0;
            if (Math.random() < 0.25) {
              const slideX = touchingWallDir === -1 ? p.x : p.x + p.width;
              eng.particles.push({
                x: slideX,
                y: p.y + p.height,
                vx: -touchingWallDir * (Math.random() * 0.8),
                vy: -Math.random() * 1.5,
                radius: 1.5,
                color: '#38bdf8',
                alpha: 0.6,
              });
            }
          }
        } else {
          p.wallContact = 0;
          if (p.isGrounded) {
            p.wallCoyoteTimer = 0;
          } else if (p.wallCoyoteTimer > 0) {
            p.wallCoyoteTimer--;
          }
        }

        // Hazard Collision Checks
        for (const h of eng.hazards) {
          if (h.type === 'hidden-spike' && !h.revealed) continue;

          if (
            p.x < h.x + h.width &&
            p.x + p.width > h.x &&
            p.y < h.y + h.height &&
            p.y + p.height > h.y
          ) {
            killPlayer();
            return;
          }
        }

        // Out of Bounds Check
        if (p.y > CANVAS_HEIGHT + 20) {
          killPlayer();
          return;
        }

        // -------------------------------------------------------------
        // GOAL PORTAL REACHED CHECK
        // -------------------------------------------------------------
        if (eng.portal.x > 0) {
          if (
            p.x < eng.portal.x + eng.portal.width &&
            p.x + p.width > eng.portal.x &&
            p.y < eng.portal.y + eng.portal.height &&
            p.y + p.height > eng.portal.y
          ) {
            sound.playWarp();
            sound.playCreditGain();

            if (eng.currentLevel < 100) {
              loadLevel(eng.currentLevel + 1);
            } else {
              setIsGameCompleted(true);
              sound.playVictory();
            }
            return;
          }
        }
      }

      // -------------------------------------------------------------
      // UPDATE PARTICLES
      // -------------------------------------------------------------
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;
        if (pt.alpha <= 0) {
          eng.particles.splice(i, 1);
        }
      }

      if (eng.shakeFrames > 0) eng.shakeFrames--;

      // -------------------------------------------------------------
      // RENDER RETRO SCENE
      // -------------------------------------------------------------
      ctx.save();

      if (eng.shakeFrames > 0) {
        ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      }

      // Background
      ctx.fillStyle = '#0a0b10';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Cyber Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Render Platforms
      for (const plat of eng.platforms) {
        ctx.save();
        if (plat.type === 'floor') {
          ctx.fillStyle = '#1e2138';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#3b426f';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'wall') {
          ctx.fillStyle = '#141728';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

          // Wall grip tech ridges for visual wall-jump feedback
          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          for (let gy = plat.y + 12; gy < plat.y + plat.height - 6; gy += 18) {
            ctx.fillRect(plat.x + 2, gy, Math.max(2, plat.width - 4), 2);
          }
        } else if (plat.type === 'troll-smasher') {
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'troll-drop') {
          ctx.fillStyle = plat.triggered ? '#ef4444' : '#e2e8f0';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        } else {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        }
        ctx.restore();
      }

      // Render Hazards (Spikes & Lava)
      for (const h of eng.hazards) {
        if (h.type === 'hidden-spike' && !h.revealed) continue;

        ctx.save();
        if (h.type === 'lava') {
          ctx.fillStyle = '#ea580c';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 10;
          ctx.fillRect(h.x, h.y, h.width, h.height);
        } else {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 8;
          const count = Math.max(1, Math.floor(h.width / 12));
          const step = h.width / count;
          for (let s = 0; s < count; s++) {
            const sx = h.x + s * step;
            ctx.beginPath();
            ctx.moveTo(sx, h.y + h.height);
            ctx.lineTo(sx + step, h.y + h.height);
            ctx.lineTo(sx + step / 2, h.y);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Render Goal Portal
      if (eng.portal.x > 0) {
        ctx.save();
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(eng.portal.x, eng.portal.y, eng.portal.width, eng.portal.height);

        // Inner Void
        ctx.fillStyle = '#0a0b10';
        ctx.fillRect(eng.portal.x + 3, eng.portal.y + 3, eng.portal.width - 6, eng.portal.height - 6);

        // Swirling Portal Core
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(
          eng.portal.x + eng.portal.width / 2,
          eng.portal.y + eng.portal.height / 2,
          5 + Math.sin(Date.now() * 0.008) * 1.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // Render Boss: "The Vanguard"
      if (eng.bossEntity) {
        const boss = eng.bossEntity;
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;

        ctx.fillStyle = boss.hitFlash > 0 ? '#ffffff' : '#dc2626';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);

        // Boss Eyes
        const lookDir = Math.sign(p.x - boss.x);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(boss.x + 12, boss.y + 18, 9, 12);
        ctx.fillRect(boss.x + boss.width - 21, boss.y + 18, 9, 12);

        // Eyebrows
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.moveTo(boss.x + 8, boss.y + 14);
        ctx.lineTo(boss.x + 24, boss.y + 18);
        ctx.lineTo(boss.x + 8, boss.y + 18);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(boss.x + boss.width - 8, boss.y + 14);
        ctx.lineTo(boss.x + 24, boss.y + 18);
        ctx.lineTo(boss.x + boss.width - 8, boss.y + 18);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(boss.x + 14 + lookDir * 2, boss.y + 22, 4, 6);
        ctx.fillRect(boss.x + boss.width - 19 + lookDir * 2, boss.y + 22, 4, 6);

        ctx.restore();
      }

      // Render Player (Neon Cyan Square with Expressive Eyes)
      if (!eng.isDead) {
        ctx.save();
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);

        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);

        // Wall contact grip glow
        if (p.wallContact !== 0 && !p.isGrounded) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          if (p.wallContact === -1) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.height);
          } else {
            ctx.moveTo(p.x + p.width, p.y);
            ctx.lineTo(p.x + p.width, p.y + p.height);
          }
          ctx.stroke();
        }

        const eyeX = p.eyeOffset === 1 ? 3 : -1;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x + 4 + eyeX, p.y + 4, 3, 4);
        ctx.fillRect(p.x + 9 + eyeX, p.y + 4, 3, 4);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x + 5 + eyeX, p.y + 4, 1.5, 1.5);
        ctx.fillRect(p.x + 10 + eyeX, p.y + 4, 1.5, 1.5);
        ctx.restore();
      }

      // Render Particles
      for (const pt of eng.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [buildLevelData, killPlayer]);

  // --- Mobile Touch Event Handlers ---
  const handleLeftStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.left = true;
    setLeftActive(true);
  };
  const handleLeftEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.left = false;
    setLeftActive(false);
  };

  const handleRightStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.right = true;
    setRightActive(true);
  };
  const handleRightEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.right = false;
    setRightActive(false);
  };

  const handleJumpStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.up = true;
    engineRef.current.player.jumpBuffer = 7;
    setJumpActive(true);
  };
  const handleJumpEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    engineRef.current.keys.up = false;
    setJumpActive(false);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen p-2 select-none overflow-hidden bg-[#0d0e15]">
      {/* Mobile Device Container Mockup matching user specifications */}
      <div className="relative w-full max-w-[400px] h-full max-h-[820px] bg-[#151724] border-4 border-[#2d3149] rounded-[36px] shadow-2xl flex flex-col overflow-hidden crt-effect">
        
        {/* TOP HUD Bar */}
        <div className="flex justify-between items-center px-6 pt-6 pb-3 bg-[#1a1c2e] border-b border-[#2d3149] text-white shrink-0">
          <div>
            <span className="text-xs text-gray-400 block font-bold tracking-widest uppercase">Sector</span>
            <span id="level-display" className="text-xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {currentLevel} / 100
            </span>
          </div>

          <div
            id="boss-alert"
            className={`text-center font-bold text-sm bg-red-950/40 border border-red-900/60 px-3 py-1 rounded-full text-red-400 animate-pulse ${
              isBossActive ? 'block' : 'hidden'
            }`}
          >
            ⚠️ ANOMALY DETECTED
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${
                isMuted
                  ? 'border-[#2d3149] text-gray-500 bg-[#151724]'
                  : 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <div className="text-right">
              <span className="text-xs text-gray-400 block font-bold tracking-widest uppercase">Attempts</span>
              <span id="attempts-display" className="text-xl font-black text-rose-400">
                {attempts}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Quick Jump Toolbar for Testing */}
        <div className="px-4 py-1 bg-[#121422] border-b border-[#23273d] flex items-center justify-between text-[11px] font-mono text-gray-400 shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="truncate text-cyan-300 font-bold">
              {currentLevel === 14 ? 'THE VANGUARD ARENA' : `ZONE ${currentLevel}`}
            </span>
            <span className="px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-800 text-[9px] text-cyan-300 rounded font-sans tracking-wide">
              WALL-JUMP ON
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => loadLevel(14)}
              title="Test Level 14 Boss"
              className="px-2 py-0.5 bg-red-950/60 border border-red-800 hover:bg-red-900/50 text-red-300 rounded text-[10px] cursor-pointer"
            >
              Boss 14
            </button>
            <button
              onClick={() => loadLevel(100)}
              title="Test Level 100"
              className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 hover:bg-cyan-900/50 text-cyan-300 rounded text-[10px] cursor-pointer"
            >
              Zone 100
            </button>
            <button
              onClick={killPlayer}
              title="Quick respawn (R)"
              className="p-1 bg-[#1c1f33] border border-[#2d3149] text-gray-300 hover:text-white rounded cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Gameplay Canvas Wrapper */}
        <div className="relative flex-1 bg-[#0a0b10] flex justify-center items-center overflow-hidden">
          <canvas
            id="gameCanvas"
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block w-full h-full object-contain"
          ></canvas>
          
          {/* Dynamic Screen Flash/Shake Overlay */}
          <div
            id="screen-overlay"
            ref={screenOverlayRef}
            className="absolute inset-0 bg-transparent pointer-events-none transition-colors duration-75 z-20"
          ></div>

          {/* Victory Modal for 100 Levels Clear */}
          {isGameCompleted && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-md text-center">
              <div className="p-5 bg-[#151724] border-2 border-cyan-400 rounded-2xl shadow-2xl space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>ALL 100 SECTORS ESCAPED</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-wider">
                  NEBULA ESCAPED!
                </h2>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  Phenomenal reflexes! You outsmarted every troll drop, ceiling smasher, and crushed the Anomaly Bosses.
                </p>
                <div className="p-2.5 bg-cyan-950/40 border border-cyan-800 rounded font-mono text-xs text-cyan-200">
                  <div className="flex justify-between py-0.5">
                    <span>TOTAL ATTEMPTS:</span>
                    <strong className="text-rose-400">{attempts}</strong>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsGameCompleted(false);
                    loadLevel(1);
                  }}
                  className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wider rounded-xl cursor-pointer"
                >
                  PLAY AGAIN (SECTOR 1)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Touch Controller HUD Layout */}
        <div className="bg-[#1a1c2e] border-t border-[#2d3149] p-6 flex justify-between items-center select-none pb-8 shrink-0">
          {/* Left / Right D-Pad Controls */}
          <div className="flex gap-4">
            <button
              id="btn-left"
              onTouchStart={handleLeftStart}
              onTouchEnd={handleLeftEnd}
              onTouchCancel={handleLeftEnd}
              onMouseDown={handleLeftStart}
              onMouseUp={handleLeftEnd}
              onMouseLeave={handleLeftEnd}
              className={`no-select w-16 h-16 bg-[#252841] active:bg-cyan-500 active:scale-95 border-b-4 border-[#121422] active:border-cyan-700 text-white rounded-2xl flex justify-center items-center shadow-lg transition-all cursor-pointer ${
                leftActive ? 'bg-cyan-500 scale-95 border-cyan-700' : 'hover:bg-[#2e3252]'
              }`}
              style={{ touchAction: 'none' }}
              aria-label="Left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              id="btn-right"
              onTouchStart={handleRightStart}
              onTouchEnd={handleRightEnd}
              onTouchCancel={handleRightEnd}
              onMouseDown={handleRightStart}
              onMouseUp={handleRightEnd}
              onMouseLeave={handleRightEnd}
              className={`no-select w-16 h-16 bg-[#252841] active:bg-cyan-500 active:scale-95 border-b-4 border-[#121422] active:border-cyan-700 text-white rounded-2xl flex justify-center items-center shadow-lg transition-all cursor-pointer ${
                rightActive ? 'bg-cyan-500 scale-95 border-cyan-700' : 'hover:bg-[#2e3252]'
              }`}
              style={{ touchAction: 'none' }}
              aria-label="Right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Jump & Action Area */}
          <div className="flex gap-3">
            <button
              id="btn-jump"
              onTouchStart={handleJumpStart}
              onTouchEnd={handleJumpEnd}
              onTouchCancel={handleJumpEnd}
              onMouseDown={handleJumpStart}
              onMouseUp={handleJumpEnd}
              onMouseLeave={handleJumpEnd}
              className={`no-select w-24 h-16 bg-[#2d325a] active:bg-emerald-500 active:scale-95 border-b-4 border-[#16182c] active:border-emerald-700 text-white font-black tracking-wider rounded-2xl flex justify-center items-center shadow-lg transition-all uppercase text-sm cursor-pointer ${
                jumpActive ? 'bg-emerald-500 scale-95 border-emerald-700' : 'hover:bg-[#383e70]'
              }`}
              style={{ touchAction: 'none' }}
              aria-label="Jump"
            >
              JUMP
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
