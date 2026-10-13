import { SectorEvent } from '../types';

export const SECTOR_EVENTS: SectorEvent[] = [
  {
    id: 'sec-1',
    level: 1,
    sectorName: 'Sector 01: The Fractured Verge',
    title: 'Navigating the Iron Cluster Asteroid Field',
    category: 'asteroid',
    narrative: 'Sensors detect the fresh ion signature of the syndicate freighter carrying the stolen Nexus Core. However, their evasive vector plunges directly through a dense cluster of tumbling nickel-iron asteroids traveling at orbital velocities. Micrometeorites hammer the exterior forward plating.',
    logTransmission: 'COMMANDER RAYNE // FLIGHT DECK: "The thief ship is pushing their drives hard. We need to navigate this debris belt without blowing our reactor or shredding our outer hull."',
    choices: [
      {
        id: 'c1-1',
        label: 'Overcharge Forward Deflectors',
        detail: 'Divert reactor reserves into the front deflector array to blast a safe corridor through the debris.',
        costPreview: 'Consumes Energy (-15) · Protects Hull',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'Deflector arrays glow brilliant azure, vaporizing oncoming boulders. The Astral Corsair punches through unscratched.',
          hullChange: 0,
          energyChange: -15,
          creditsChange: 0,
          sfxType: 'shield'
        }
      },
      {
        id: 'c1-2',
        label: 'Thread Asteroid Gaps at Sub-Light Speed',
        detail: 'Use precision thruster micro-burns to weave between rocks, relying on manual helm reflexes.',
        costPreview: 'Conserves Energy · Risk of Hull Grazes',
        successRate: 0.75,
        outcomeSuccess: {
          text: 'Flawless piloting! You weave between massive tumbling monoliths with millimetric clearance, conserving auxiliary power.',
          hullChange: 0,
          energyChange: -5,
          creditsChange: 0,
          sfxType: 'warp'
        },
        outcomeFailure: {
          text: 'A rogue metallic shard clips the starboard stabilizer wing! Sparks shower across the cockpit viewscreen.',
          hullChange: -14,
          energyChange: -5,
          creditsChange: 0,
          sfxType: 'damage'
        }
      },
      {
        id: 'c1-3',
        label: 'Deploy Pulse Mining Laser on Heavy Masses',
        detail: 'Break down high-density mineral asteroids in your trajectory and tractor beam rare heavy metals.',
        costPreview: 'Consumes Energy (-10) · Yields Ore Credits (+40)',
        reqEnergy: 10,
        outcomeSuccess: {
          text: 'Mining lasers shatter platinum-bearing asteroids. Your magnetic cargo scoop secures raw mineral nodules for the exchange.',
          hullChange: -5,
          energyChange: -10,
          creditsChange: 40,
          sfxType: 'gain'
        }
      }
    ]
  },
  {
    id: 'sec-2',
    level: 2,
    sectorName: 'Sector 02: Deadlock Expanse',
    title: 'Encountering an Armed Scavenger Drone',
    category: 'drone',
    narrative: 'A re-purposed industrial scavenger drone locks automated targeting radar onto your vessel. Its chassis has been re-welded with stolen military kinetic cannons, and its automated audio beacon broadcasts a salvage claim over your ship.',
    logTransmission: 'TACTICAL RADAR: Hostile automated drone pinging our reactor core. Likely deployed by syndicate scouts to delay pursuit.',
    choices: [
      {
        id: 'c2-1',
        label: 'Fire Twin Plasma Cannons',
        detail: 'Execute a pre-emptive strike with the Astral Corsair\'s plasma cannons to destroy it before it opens fire.',
        costPreview: 'Consumes Energy (-18) · Salvages Scrap (+35 CR)',
        reqEnergy: 18,
        outcomeSuccess: {
          text: 'Twin bolts of superheated plasma detonate the drone\'s ammunition bay in a silent flash. You tractor in its salvageable power cells.',
          hullChange: 0,
          energyChange: -18,
          creditsChange: 35,
          sfxType: 'laser'
        }
      },
      {
        id: 'c2-2',
        label: 'Broadcast Spoofed Syndicate Transponder',
        detail: 'Transmit encrypted security codes through sub-space to trick the drone\'s target identification algorithm.',
        costPreview: 'Requires Tech Bypass · Success: Safe passage',
        successRate: 0.70,
        outcomeSuccess: {
          text: 'The spoof handshake verifies! The drone lowers its targeting array, registers you as a friendly courier, and powers down.',
          hullChange: 0,
          energyChange: -5,
          creditsChange: 15,
          sfxType: 'warp'
        },
        outcomeFailure: {
          text: 'Transponder spoof rejected! The drone fires an explosive rotary slug before self-destructing against your ventral armor.',
          hullChange: -18,
          energyChange: 0,
          creditsChange: 10,
          sfxType: 'damage'
        }
      },
      {
        id: 'c2-3',
        label: 'Emergency Countermeasure Jamming Burn',
        detail: 'Deploy ECM chaff flares and initiate an evasive boost burn to leave the drone in your exhaust wake.',
        costPreview: 'Consumes Energy (-12) · Zero Hull Damage',
        reqEnergy: 12,
        outcomeSuccess: {
          text: 'ECM chaff clouds blind the drone\'s optical sensors. The Astral Corsair surges forward into the warp corridor unimpeded.',
          hullChange: 0,
          energyChange: -12,
          creditsChange: 0,
          sfxType: 'shield'
        }
      }
    ]
  },
  {
    id: 'sec-3',
    level: 3,
    sectorName: 'Sector 03: The Ghost Orbit',
    title: 'Boarding the Derelict Frigate "Kallisto IV"',
    category: 'derelict',
    narrative: 'A heavy cargo frigate drifts silently in the gravitational wake of a ringed gas giant. Its emergency beacon repeats an automated distress loop. Hull scorches indicate it was recently attacked by high-energy weaponry matching the Nexus Core syndicate.',
    logTransmission: 'COMMANDER RAYNE: "The Kallisto was an Outer Rim science transport. If they crossed paths with the thieves, their data banks might hold crucial coordinates."',
    choices: [
      {
        id: 'c3-1',
        label: 'Send EVA Boarding Drone to Bridge',
        detail: 'Remotely pilot an exploratory drone through the ruptured airlock to download sensor logs and flight manifests.',
        costPreview: 'Consumes Energy (-10) · Gains Telemetry & Credits (+55 CR)',
        reqEnergy: 10,
        outcomeSuccess: {
          text: 'The drone interfaces with the Kallisto\'s black box. You extract decrypted nav-logs pointing toward Sector 15 plus unspent escrow credits.',
          hullChange: 0,
          energyChange: -10,
          creditsChange: 55,
          sfxType: 'gain'
        }
      },
      {
        id: 'c3-2',
        label: 'Dock Directly & Siphon Emergency Deuterium',
        detail: 'Couple magnetic docking clamps to the fuel ports to recharge your primary energy grid.',
        costPreview: 'Restores Energy (+35) · Risk of Unstable Core Leak',
        successRate: 0.80,
        outcomeSuccess: {
          text: 'Fuel transfer successful! Pristine deuterium floods your auxiliary capacitors, replenishing ship systems.',
          hullChange: 0,
          energyChange: 35,
          creditsChange: 0,
          sfxType: 'heal'
        },
        outcomeFailure: {
          text: 'A pressure rupture in the Kallisto\'s coolant line blasts caustic gas against your cockpit seals! Hull integrity compromised.',
          hullChange: -15,
          energyChange: 15,
          creditsChange: 0,
          sfxType: 'damage'
        }
      },
      {
        id: 'c3-3',
        label: 'Bypass Derelict & Maintain Pursuit Vectors',
        detail: 'Ignore the temptation of salvage to conserve ship systems and stay hot on the stolen core\'s trail.',
        costPreview: 'Safe Transit · Minor Systems Idle Recharge',
        outcomeSuccess: {
          text: 'Discipline prevails. You record the derelict\'s coordinates for salvage authorities and maintain high warp velocity.',
          hullChange: 0,
          energyChange: 10,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-4',
    level: 4,
    sectorName: 'Sector 04: The Smuggler\'s Shadow',
    title: 'Covert Rendezvous at Outpost Null-9',
    category: 'smuggler',
    narrative: 'Hollowed out inside a hollowed nickel comet, Outpost Null-9 is an unlicensed haven for free-traders, mercenary pilots, and black-market fixers. A cyber-enhanced arms dealer recognizes Commander Rayne\'s uniform.',
    logTransmission: 'OUTPOST FREQUENCY: "Looking for that hyper-dense prototype core, Commander? We know who bought the warp fuel... if you have the coin."',
    choices: [
      {
        id: 'c4-1',
        label: 'Purchase Black-Market Hull Armor Nanites',
        detail: 'Pay the dealer for military-grade repair nanites to patch micro-fissures in your hull plating.',
        costPreview: 'Costs 50 Credits · Restores +35 Hull Health',
        reqCredits: 50,
        outcomeSuccess: {
          text: 'Nanite canisters deploy across the hull, knitting carbon-ceramic plating back together with glowing blue seams.',
          hullChange: 35,
          energyChange: 0,
          creditsChange: -50,
          sfxType: 'heal'
        }
      },
      {
        id: 'c4-2',
        label: 'Bribe Informant for Nexus Core Vector Data',
        detail: 'Hand over 40 credits for intercepted transmission logs containing the syndicate\'s warp route.',
        costPreview: 'Costs 40 Credits · Boosts Reactor Efficiency & Intel (+30 Energy)',
        reqCredits: 40,
        outcomeSuccess: {
          text: 'The informant slips you an encrypted data-spike. Navigating around syndicate listening posts allows uninhibited reactor throttling.',
          hullChange: 0,
          energyChange: 30,
          creditsChange: -40,
          sfxType: 'gain'
        }
      },
      {
        id: 'c4-3',
        label: 'Sell Spare Sensor Telemetry',
        detail: 'Sell your stellar cartography logs of the nearby asteroid belt to local miners.',
        costPreview: 'Consumes Energy (-8) · Gains +45 Credits',
        reqEnergy: 8,
        outcomeSuccess: {
          text: 'The station guild happily transfers credits for your high-resolution scanner maps of the nearby mineral fields.',
          hullChange: 0,
          energyChange: -8,
          creditsChange: 45,
          sfxType: 'gain'
        }
      }
    ]
  },
  {
    id: 'sec-5',
    level: 5,
    sectorName: 'Sector 05: Helios Terminus',
    title: 'Coronal Mass Ejection: Solar Radiation Surge',
    category: 'flare',
    narrative: 'A dying red supergiant star undergoes violent surface turbulence. A wall of blinding ionized plasma expands across the entire sector at relativistic speeds. Cabin radiation sirens blare in shrill tones.',
    logTransmission: 'SENSOR ALERT: Coronal shockwave impact in T-minus 12 seconds. High-energy gamma wave will cook auxiliary relays.',
    choices: [
      {
        id: 'c5-1',
        label: 'Angle Magnetic Deflector Shielding',
        detail: 'Rotate the ship to meet the wave bow-first with energized magnetic shielding.',
        costPreview: 'Consumes Energy (-22) · Protects Ship completely',
        reqEnergy: 22,
        outcomeSuccess: {
          text: 'The magnetic shield deflects millions of tons of incandescent plasma like water off a prow. Cockpit displays glow blue.',
          hullChange: 0,
          energyChange: -22,
          creditsChange: 0,
          sfxType: 'shield'
        }
      },
      {
        id: 'c5-2',
        label: 'Dive Behind Massive C-Type Moon for Cover',
        detail: 'Execute a high-G orbital dive into the shadow of a barren rocky moon to use its bulk as an umbrella.',
        costPreview: 'Risk of Thruster Burnout · Zero Energy Cost',
        successRate: 0.70,
        outcomeSuccess: {
          text: 'You slip into the dark side of the moon just as the solar wave scorches the outer atmosphere. Complete shelter achieved!',
          hullChange: 0,
          energyChange: 0,
          creditsChange: 0,
          sfxType: 'warp'
        },
        outcomeFailure: {
          text: 'A secondary magnetic eddy sweeps around the moon\'s limb! High-energy radiation superheats external cooling conduits.',
          hullChange: -22,
          energyChange: -10,
          creditsChange: 0,
          sfxType: 'damage'
        }
      },
      {
        id: 'c5-3',
        label: 'Deploy Solar Induction Collectors',
        detail: 'Open emergency collector sails to harvest the immense ambient solar energy into ship capacitors.',
        costPreview: 'Takes Moderate Hull Heat (-12) · Massive Energy Recharge (+45)',
        outcomeSuccess: {
          text: 'Collector arrays glow cherry red under intense bombardment, but the capacitors surge to maximum capacity!',
          hullChange: -12,
          energyChange: 45,
          creditsChange: 0,
          sfxType: 'heal'
        }
      }
    ]
  },
  {
    id: 'sec-6',
    level: 6,
    sectorName: 'Sector 06: Bloodstone Chasm',
    title: 'Ambush by Outer Rim Raider Corvettes',
    category: 'combat',
    narrative: 'Two heavily armored pirate corvettes drop out of stealth right above your flight path. They have painted the symbol of the Outer Rim syndicate across their hulls—mercenaries hired to delay Commander Rayne\'s pursuit.',
    logTransmission: 'COMMANDER RAYNE: "They think they can corner us in the Chasm. Shields up, lock plasma coils!"',
    choices: [
      {
        id: 'c6-1',
        label: 'Fire Full Plasma Cannon Salvo',
        detail: 'Deliver a focused double-volley into the lead raider\'s propulsion drives.',
        costPreview: 'Consumes Energy (-24) · Destroys Raider · Salvages +60 CR',
        reqEnergy: 24,
        outcomeSuccess: {
          text: 'Brilliant blue plasma lances pierce the lead ship\'s shield bubble, detonating its reactor. The secondary corvette breaks formation and flees!',
          hullChange: 0,
          energyChange: -24,
          creditsChange: 60,
          sfxType: 'laser'
        }
      },
      {
        id: 'c6-2',
        label: 'Close Combat Ramming & Point-Defense Sweep',
        detail: 'Rely on heavy reinforced prow armor to scatter their attack vector while shredding shields with point defense.',
        costPreview: 'Takes Hull Scrapes (-15) · Gains Heavy Salvage (+75 CR)',
        outcomeSuccess: {
          text: 'The Astral Corsair punches through their crossfire! Heavy kinetic collisions tear their wings to ribbons. Salvage collected.',
          hullChange: -15,
          energyChange: -5,
          creditsChange: 75,
          sfxType: 'damage'
        }
      },
      {
        id: 'c6-3',
        label: 'Deploy Sensor Decoy & Warp Jump',
        detail: 'Launch a holographic false-signature decoy drone and execute an immediate blind jump.',
        costPreview: 'Consumes Energy (-15) · Zero Damage Taken',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'The raiders discharge their ordnance into empty vacuum chasing your ghost echo while you slip clean into hyperspace.',
          hullChange: 0,
          energyChange: -15,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-7',
    level: 7,
    sectorName: 'Sector 07: The Tachyon Fold',
    title: 'Investigating a Spatial Rift Anomaly',
    category: 'anomaly',
    narrative: 'Space-time appears warped in this sector. A swirling sapphire rift pulses like a cosmic heartbeat. Residual telemetry indicates the stolen Nexus Core released a massive discharge of dark energy when warping through here.',
    logTransmission: 'SCIENCE STATION: Anomaly resonance matches the quantum frequency of the Nexus Core. We can probe it or harvest stray tachyon particles.',
    choices: [
      {
        id: 'c7-1',
        label: 'Harmonize Deflector Frequency to Absorb Rift Energy',
        detail: 'Tune your defensive shields to match the anomaly\'s harmonic frequency and recharge the ship\'s power cells.',
        costPreview: 'Restores Energy (+40) · Safe Resonance',
        outcomeSuccess: {
          text: 'Cascades of pure blue quantum light dance across the hull. The ship\'s energy grid hums with unprecedented stability.',
          hullChange: 0,
          energyChange: 40,
          creditsChange: 0,
          sfxType: 'heal'
        }
      },
      {
        id: 'c7-2',
        label: 'Launch Scientific Probe into the Rift Vortex',
        detail: 'Deploy a high-resolution probe to extract quantum data and rare tachyon crystals.',
        costPreview: 'Consumes Energy (-12) · Gains +70 Credits',
        reqEnergy: 12,
        outcomeSuccess: {
          text: 'The probe transmits pristine quantum physics metrics and collects condensed tachyon condensates valued by tech syndicates.',
          hullChange: 0,
          energyChange: -12,
          creditsChange: 70,
          sfxType: 'gain'
        }
      },
      {
        id: 'c7-3',
        label: 'Re-Calibrate Nav-Sensors with Nexus Core Residue',
        detail: 'Analyze the rift\'s residue to lock onto the exact signature of the stolen Core.',
        costPreview: 'Optimizes Combat Targeting Systems (+15 Energy, +20 Credits)',
        outcomeSuccess: {
          text: 'Sensor resolution reaches peak accuracy. The trail of the Nexus Core is now unshakeable.',
          hullChange: 0,
          energyChange: 15,
          creditsChange: 20,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-8',
    level: 8,
    sectorName: 'Sector 08: The Siren Trench',
    title: 'Deciphering a Distress Beacon from Cargo Hauler',
    category: 'outpost',
    narrative: 'An emergency beacon flickers in an asteroid trench. A damaged civilian cargo hauler, "Star of Orion", is bleeding atmosphere. Its captain begs for assistance, claiming pirates stripped their emergency batteries.',
    logTransmission: 'AUDIO COMMS: "Mayday... life support at 18%... we have no fuel to clear the gravitational pull of the asteroid trench..."',
    choices: [
      {
        id: 'c8-1',
        label: 'Transfer Emergency Power Cells to the Hauler',
        detail: 'Beam high-capacity energy conduits across to stabilize their life support and engines.',
        costPreview: 'Transfers Energy (-25) · Rewarded with Rare Salvage (+80 CR)',
        reqEnergy: 25,
        outcomeSuccess: {
          text: 'Their life support roars back to life! Grateful for their lives, the crew transfers their precious cargo of raw bullion and parts.',
          hullChange: 0,
          energyChange: -25,
          creditsChange: 80,
          sfxType: 'gain'
        }
      },
      {
        id: 'c8-2',
        label: 'Tractor Hauler into Safe Orbit',
        detail: 'Fire the heavy gravity tow cables to pull the massive freighter out of the gravitational pit.',
        costPreview: 'Strains Hull (-10) & Consumes Energy (-15) · Crew repairs Hull (+25)',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'With synchronized burns, you drag the freighter clear. Their onboard technicians assist by patching structural stress on your hull.',
          hullChange: 15,
          energyChange: -15,
          creditsChange: 35,
          sfxType: 'heal'
        }
      },
      {
        id: 'c8-3',
        label: 'Relay Automated Emergency Beacon & Maintain Velocity',
        detail: 'Boost their signal to Outer Rim patrol frequencies without halting your hunt for the Nexus Core.',
        costPreview: 'Zero Cost · Maintains Pursuit Priority',
        outcomeSuccess: {
          text: 'You ping Outer Rim rescue authorities and keep all thrusters firing. Duty to the Nexus Core admits no delay.',
          hullChange: 0,
          energyChange: 5,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-9',
    level: 9,
    sectorName: 'Sector 09: Apex Orbital Dock',
    title: 'Restocking at the Freeport Star-Dock',
    category: 'outpost',
    narrative: 'A sprawling orbital docking hub hangs over an icy moon. The Freeport operates under neutral merchant law, offering specialized military dry-dock facilities for captains who can afford the asking price.',
    logTransmission: 'STATION MASTER: "Welcome to Apex Dock, Commander. We have pressurized dry-docks, high-density fuel rods, and heavy ordinance in stock."',
    choices: [
      {
        id: 'c9-1',
        label: 'Dry-Dock Hull Structural Overhaul',
        detail: 'Hire an automated shipyard gantry to replace warped armor bulkheads and re-seal pressure valves.',
        costPreview: 'Costs 60 Credits · Restores +45 Hull Health',
        reqCredits: 60,
        outcomeSuccess: {
          text: 'Hydraulic welding arms work with laser precision. Your hull integrity is restored to peak condition!',
          hullChange: 45,
          energyChange: 0,
          creditsChange: -60,
          sfxType: 'heal'
        }
      },
      {
        id: 'c9-2',
        label: 'Supercharge Reactor Fuel Cells',
        detail: 'Purchase high-grade enriched antimatter pellets to overcharge your energy reserves.',
        costPreview: 'Costs 40 Credits · Restores +50 Energy',
        reqCredits: 40,
        outcomeSuccess: {
          text: 'The reactor core hums with clean blue energy. All auxiliary batteries report 100% capacity.',
          hullChange: 0,
          energyChange: 50,
          creditsChange: -40,
          sfxType: 'heal'
        }
      },
      {
        id: 'c9-3',
        label: 'Calibrate Targeting Matrix with Station Technicians',
        detail: 'Fine-tune weapon convergence and plasma compression nozzles for high-stakes combat.',
        costPreview: 'Costs 25 Credits · Yields Systems Synergy (+15 Energy, +15 Hull)',
        reqCredits: 25,
        outcomeSuccess: {
          text: 'Technicians optimize power flow curves between shields and weapons, improving general combat readiness.',
          hullChange: 15,
          energyChange: 15,
          creditsChange: -25,
          sfxType: 'shield'
        }
      }
    ]
  },
  {
    id: 'sec-10',
    level: 10,
    sectorName: 'Sector 10: The Veil of Lightning',
    title: 'Surviving an Ion Storm Surge',
    category: 'flare',
    narrative: 'A deep violet ion storm stretches across millions of kilometers. Cascading arcs of electromagnetic lightning leap between ionized dust clouds, discharging millions of gigawatts of volatile charge directly into passing ships.',
    logTransmission: 'WARNING: EMP discharges overloading auxiliary conduits. Primary telemetry flickers violently.',
    choices: [
      {
        id: 'c10-1',
        label: 'Ground Hull with Dispersal Filaments',
        detail: 'Extend trailing copper-composite cables to bleed off electric charge into the vacuum of space.',
        costPreview: 'Consumes Energy (-18) · Completely Protects Hull',
        reqEnergy: 18,
        outcomeSuccess: {
          text: 'Lightning arcs strike the cockpit canopy and dissipate harmlessly down the trailing grounding cables.',
          hullChange: 0,
          energyChange: -18,
          creditsChange: 0,
          sfxType: 'shield'
        }
      },
      {
        id: 'c10-2',
        label: 'Route Static Arcs through Auxiliary Batteries',
        detail: 'Open power shunts to capture and convert incoming lightning into usable reactor energy.',
        costPreview: 'Chance of Reactor Surge (+40 Energy) or Conduit Blowout (-20 Hull)',
        successRate: 0.70,
        outcomeSuccess: {
          text: 'A brilliant burst of electromagnetic energy surges through the converters! Power reserves spike dramatically.',
          hullChange: 0,
          energyChange: 40,
          creditsChange: 0,
          sfxType: 'heal'
        },
        outcomeFailure: {
          text: 'The lightning surge exceeds capacitor thresholds! A power conduit on the lower deck explodes in an electrical fire.',
          hullChange: -20,
          energyChange: 15,
          creditsChange: 0,
          sfxType: 'damage'
        }
      },
      {
        id: 'c10-3',
        label: 'Emergency Warp Punch',
        detail: 'Discharge emergency hyper-fuel to warp through the storm before secondary lightning can lock on.',
        costPreview: 'Consumes Energy (-25) · Clean Transit',
        reqEnergy: 25,
        outcomeSuccess: {
          text: 'The warp engine tears a clean tunnel through the ionized purple clouds. The storm is left light-years behind.',
          hullChange: 0,
          energyChange: -25,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-11',
    level: 11,
    sectorName: 'Sector 11: The Ring of Ancients',
    title: 'Deciphering the Precursor Relic Ring',
    category: 'anomaly',
    narrative: 'A gigantic derelict megastructure—a silent ring made of an unknown matte-black element—spans twenty kilometers across. It emits harmonic resonance pulses that interact directly with the signature of the stolen Nexus Core.',
    logTransmission: 'COMMANDER RAYNE: "The thieves stopped here. Look at the energy scorches on the docking pylon. They activated the relic\'s central ring."',
    choices: [
      {
        id: 'c11-1',
        label: 'Interface with the Central Console Terminal',
        detail: 'Transmit a cyber-key to communicate with the dormant alien computer network.',
        costPreview: 'Consumes Energy (-15) · Rewards Ancient Tech Valuables (+90 CR)',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'The terminal unlocks, dispensing encrypted precursor algorithmic cores. Tech collectors in the core worlds will pay a king\'s ransom.',
          hullChange: 0,
          energyChange: -15,
          creditsChange: 90,
          sfxType: 'gain'
        }
      },
      {
        id: 'c11-2',
        label: 'Bask in the Relic\'s Nano-Restoration Field',
        detail: 'Maneuver into the ring\'s center where harmonic fields heal metal fatigue.',
        costPreview: 'Restores +25 Hull & +20 Energy',
        outcomeSuccess: {
          text: 'Subatomic harmonic waves soothe the hull\'s molecular lattice. Microscopic stress fractures seal and energy coils settle into resonance.',
          hullChange: 25,
          energyChange: 20,
          creditsChange: 0,
          sfxType: 'heal'
        }
      },
      {
        id: 'c11-3',
        label: 'Scan Navigational Starchart Projection',
        detail: 'Extract the hyperlane map locked into the ring\'s ancient stellar observatory.',
        costPreview: 'Optimizes Flight Route · Safe Passage (+15 Energy)',
        outcomeSuccess: {
          text: 'A brilliant holographic map illuminates the bridge, highlighting hidden shortcut corridors directly into Sector 15.',
          hullChange: 0,
          energyChange: 15,
          creditsChange: 10,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-12',
    level: 12,
    sectorName: 'Sector 12: Cipher Array Zero',
    title: 'Disabling the Syndicate Void Siphon',
    category: 'drone',
    narrative: 'A deep space surveillance relay tethered to an asteroid is transmitting high-frequency telemetry. It belongs to the Void Vanguard\'s vanguard fleet, actively tracking any pursuit vessels entering the final perimeter.',
    logTransmission: 'TACTICAL ALERT: Array has detected the Astral Corsair. Scramble weapons or jam before it transmits our shield specs!',
    choices: [
      {
        id: 'c12-1',
        label: 'Precision Torpedo Strike on Array Emitter',
        detail: 'Launch a high-explosive ordnance strike to silence the relay immediately.',
        costPreview: 'Consumes Energy (-20) · Scraps Tech (+40 CR)',
        reqEnergy: 20,
        outcomeSuccess: {
          text: 'Direct hit! The emitter dish disintegrates in a silent eruption of debris. Their surveillance link is severed.',
          hullChange: 0,
          energyChange: -20,
          creditsChange: 40,
          sfxType: 'laser'
        }
      },
      {
        id: 'c12-2',
        label: 'Transmit Counter-Logic Virus into Array',
        detail: 'Hack into their relay and feed corrupted telemetry while siphoning their auxiliary fuel.',
        costPreview: 'Risk of Counter-Shock · Success: Siphons +35 Energy, +50 Credits',
        successRate: 0.75,
        outcomeSuccess: {
          text: 'The counter-hack overrides their security firewall! You drain their capacitor banks and extract encrypted bank transfers.',
          hullChange: 0,
          energyChange: 35,
          creditsChange: 50,
          sfxType: 'gain'
        },
        outcomeFailure: {
          text: 'A defensive logic bomb rebounds through your comms array! Cockpit monitors flicker and defensive relays blow.',
          hullChange: -18,
          energyChange: -15,
          creditsChange: 0,
          sfxType: 'damage'
        }
      },
      {
        id: 'c12-3',
        label: 'Deploy Ghost Cloaking Pulse',
        detail: 'Expend energy to mask thermal emissions and glide past the sensor perimeter in silence.',
        costPreview: 'Consumes Energy (-15) · Zero Damage Taken',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'Thermal cloak engages. The Astral Corsair appears as empty cosmic background radiation on their displays.',
          hullChange: 0,
          energyChange: -15,
          creditsChange: 0,
          sfxType: 'shield'
        }
      }
    ]
  },
  {
    id: 'sec-13',
    level: 13,
    sectorName: 'Sector 13: Iron Sepulcher',
    title: 'Navigating the Graveyard of Dreadnoughts',
    category: 'derelict',
    narrative: 'Hundreds of shattered capital ships drift in eerie silence. This was the site of the catastrophic Battle of the Rim centuries ago. Corrupted parasite drones and dark-energy mines drift lazily among the colossal hulls.',
    logTransmission: 'COMMANDER RAYNE: "Look at the sheer scale of these wrecks... And look at the fresh burns on that dreadnought. The Void Vanguard passed through here minutes ago."',
    choices: [
      {
        id: 'c13-1',
        label: 'Salvage Capital-Grade Shield Emitters',
        detail: 'Send heavy grapple lines into a shattered flagship to extract military shield capacitors.',
        costPreview: 'Consumes Energy (-15) · Restores +30 Hull & +60 Credits',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'You haul aboard pristine military shield modules. Your engineering bay fits them to reinforce your primary hull matrix.',
          hullChange: 30,
          energyChange: -15,
          creditsChange: 60,
          sfxType: 'heal'
        }
      },
      {
        id: 'c13-2',
        label: 'Disarm and Disassemble Dark Matter Mines',
        detail: 'Carefully neutralize proximity mines to scavenge their hyper-dense explosive cores.',
        costPreview: 'High Risk / High Reward · Success: +95 Credits & +25 Energy',
        successRate: 0.70,
        outcomeSuccess: {
          text: 'Expert defusal! You disarm three dark-matter charges, extracting exotic matter worth a fortune in the Core Worlds.',
          hullChange: 0,
          energyChange: 25,
          creditsChange: 95,
          sfxType: 'gain'
        },
        outcomeFailure: {
          text: 'A mine triggers a micro-singularity pulse! Gravitational shockwaves buckle the forward armor plates.',
          hullChange: -25,
          energyChange: -10,
          creditsChange: 25,
          sfxType: 'damage'
        }
      },
      {
        id: 'c13-3',
        label: 'Stealth Cruise Through Dead Engines',
        detail: 'Navigate through the hollow exhaust tubes of the gigantic flagship to avoid all proximity traps.',
        costPreview: 'Consumes Energy (-10) · Guarantees Safe Passage',
        reqEnergy: 10,
        outcomeSuccess: {
          text: 'Using minimal maneuvering thrusters, you slip like a phantom through the rusted megastructures into the outer rim abyss.',
          hullChange: 0,
          energyChange: -10,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  },
  {
    id: 'sec-14',
    level: 14,
    sectorName: 'Sector 14: The Threshold of Oblivion',
    title: 'The Event Horizon of the Abyssal Tear',
    category: 'anomaly',
    narrative: 'You have arrived at the edge of mapped space. A colossal tear in space-time—The Abyssal Tear—swirls with terrifying dark matter. Beyond lies Sector 15. The ion trail of the stolen Nexus Core ends directly inside the dark singularity ahead.',
    logTransmission: 'COMMANDER RAYNE: "All crew and systems: prepare for battle stations. The stolen Nexus Core is within striking distance. Behind that horizon lies The Void Vanguard."',
    choices: [
      {
        id: 'c14-1',
        label: 'Overcharge All Systems for Final Insertion',
        detail: 'Burn remaining credit vouchers to prime the reactor and reinforce critical structural bulkheads.',
        costPreview: 'Costs 50 Credits · Restores +30 Hull & +30 Energy',
        reqCredits: 50,
        outcomeSuccess: {
          text: 'Every system glows with surplus power. The Astral Corsair is primed and ready for the ultimate confrontation.',
          hullChange: 30,
          energyChange: 30,
          creditsChange: -50,
          sfxType: 'heal'
        }
      },
      {
        id: 'c14-2',
        label: 'Conduct Diagnostic Core Calibration',
        detail: 'Run exhaustive self-tests on plasma cannon conduits and shield harmonics before crossing the threshold.',
        costPreview: 'Consumes Energy (-15) · Restores +20 Hull Health',
        reqEnergy: 15,
        outcomeSuccess: {
          text: 'Diagnostics clear! Weapon convergence error reduced to zero. Deflector shielding is locked in optimal resonance.',
          hullChange: 20,
          energyChange: -15,
          creditsChange: 0,
          sfxType: 'shield'
        }
      },
      {
        id: 'c14-3',
        label: 'Emergency Warp Leap into Sector 15',
        detail: 'Full throttle directly into the heart of the anomaly to catch The Void Vanguard before it can anchor the Core!',
        costPreview: 'Conserves Resources · Instant Jump into Boss Encounter',
        outcomeSuccess: {
          text: 'The Astral Corsair breaches the event horizon! Space-time tears open, revealing the terrifying black silhouette of The Void Vanguard!',
          hullChange: 0,
          energyChange: 10,
          creditsChange: 0,
          sfxType: 'warp'
        }
      }
    ]
  }
];
