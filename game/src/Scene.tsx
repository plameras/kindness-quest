import {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import {faceLines, reactions, type Expression} from './expressions';
import type {SceneAction} from './story';

class SchoolScene extends Phaser.Scene {
  private actors: Phaser.GameObjects.Container[] = [];
  private faces = new Map<Phaser.GameObjects.Container, Phaser.GameObjects.Graphics>();
  private lastAction?: SceneAction;
  private lastMotion?: boolean;

  constructor(private lunch: boolean, private state: () => {action?: SceneAction; motion: boolean}) {
    super('school');
  }

  create() {
    const g = this.add.graphics();
    const box = (color: number, x: number, y: number, w: number, h: number, radius = 0) => {
      g.fillStyle(color).fillRoundedRect(x, y, w, h, radius);
    };
    const oval = (color: number, x: number, y: number, w: number, h: number) => g.fillStyle(color).fillEllipse(x, y, w, h);
    box(this.lunch ? 0xf9d9a4 : 0xbbdff1, 0, 0, 720, 330);
    if (this.lunch) {
      for (const x of [46, 178, 310]) {
        box(0xab786e, x, 25, 104, 90, 9);
        box(0xd5ecfa, x+6, 31, 92, 78, 5);
        box(0xab786e, x+49, 31, 6, 78);
      }
      box(0xd29880, 0, 125, 720, 205);
      for (const x of [100, 340, 580]) {
        oval(0xa76060, x, 212, 170, 26);
        box(0xf5ac62, x-75, 160, 150, 19, 8);
        box(0x9e5e63, x-62, 179, 11, 39, 4);
        box(0x9e5e63, x+52, 179, 11, 39, 4);
      }
    } else {
      for (const [x,y] of [[100,57],[365,44],[560,69]]) {
        oval(0xeaf6f7,x,y,101,22); oval(0xeaf6f7,x-6,y-10,48,32); oval(0xeaf6f7,x+20,y-4,42,26);
      }
      oval(0xffdc85, 650, 58, 57, 57);
      oval(0x8abda2,100,169,382,115); oval(0x94c9a5,566,156,410,97);
      box(0x9fc487,0,163,720,167);
      box(0xe6c59e,0,219,720,111);
      for(let x=0;x<720;x+=64) {
        box(0xf5e4bd,x,136,5,31,2);
      }
      box(0xf5e4bd,0,144,720,5); box(0xf5e4bd,0,155,720,5);
      for(const [x,y] of [[75,106],[633,121],[681,126]]) {
        box(0xa27265,x-5,y,10,72,4);
        oval(0x508f7a,x,y-2,69,73); oval(0x6fa78a,x-13,y-12,47,48);
      }
      box(0xe18a70,335,119,8,82,4); box(0xe18a70,444,119,8,82,4);
      box(0xe18a70,329,117,129,9,4);
      for(const x of [365,420]) {
        box(0x7f707f,x-10,126,3,47); box(0x7f707f,x+9,126,3,47); box(0xf3b870,x-14,171,30,7,3);
      }
      box(0x925d62,174,183,86,10,4); box(0xb07668,172,197,90,7,3);
      box(0x925d62,179,203,7,17,3); box(0x925d62,249,203,7,17,3);
      for(const [x,y] of [[23,193],[120,178],[280,195],[577,199],[691,184],[526,181]]) {
        box(0x73a777,x,y,17,4,2); oval(0xf6da85,x+10,y-2,5,5);
      }
    }
    const friend = this.person(211, 225, 0x8457b9, 0xa8664b, 0x362a44, this.lunch ? 'JO' : 'SAM');
    const first = this.person(343, 233, 0xe79955, 0xe6a982, 0x55383c);
    const second = this.person(392, 218, 0x548eaa, 0xbd7a58, 0x402e4e);
    const adult = this.person(572, 223, 0x568d76, 0xe4a57f, 0x623746, this.lunch ? 'MR. LEE' : 'MS. RIVERA', 1.16);
    const player = this.person(104, 268, 0xec8b78, 0xb87552, 0x382b45, 'YOU');
    this.actors = [friend, first, second, adult, player];
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.state().action) this.move(player, Phaser.Math.Clamp(pointer.x,48,675), Phaser.Math.Clamp(pointer.y,233,290));
    });
  }

  update() {
    const {action, motion} = this.state();
    if (action === this.lastAction && motion === this.lastMotion) return;
    this.lastAction = action;
    this.lastMotion = motion;

    const [friend, first, second, adult, player] = this.actors;
    const home: [number, number][] = [[211,225],[343,233],[392,218],[572,223],[104,268]];
    this.actors.forEach((actor, index) => {
      this.tweens.killTweensOf(actor);
      actor.setPosition(...home[index]);
    });

    const expression = reactions(action);
    this.drawFace(friend, expression.friend);
    this.drawFace(player, expression.player);
    this.drawFace(adult, expression.adult);
    this.drawFace(first, action === 'unsafe' ? 'surprised' : 'neutral');
    this.drawFace(second, action === 'unsafe' ? 'surprised' : 'neutral');

    switch (action) {
      case 'support':
        this.move(player, 168, 249);
        this.move(friend, 219, 238);
        break;
      case 'help':
      case 'vague':
        this.move(player, 523, 254);
        break;
      case 'report':
        this.move(player, 516, 254);
        this.move(adult, 541, 219);
        this.move(friend, 472, 228);
        break;
      case 'unsafe':
        this.move(player, 315, 261);
        if (!this.lunch) {
          this.move(first, 415, 233);
          this.move(second, 454, 220);
        }
        break;
      case 'pattern':
        this.move(first, this.lunch ? 268 : 273, 232);
        this.move(second, 316, 221);
        this.move(friend, 188, 226);
        break;
      case 'mistake':
        this.move(friend, 183, 225);
        break;
      default:
        if (motion) this.tweens.add({targets: [first, second], y: '-=3', duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'});
    }
  }

  private move(actor: Phaser.GameObjects.Container, x: number, y: number) {
    this.tweens.killTweensOf(actor);
    if (this.state().motion) this.tweens.add({targets: actor, x, y, duration: 540, ease: 'Sine.easeInOut'});
    else actor.setPosition(x,y);
  }

  private drawFace(actor: Phaser.GameObjects.Container, expression: Expression) {
    const face = this.faces.get(actor);
    if (!face) return;
    face.clear().fillStyle(0x483044).fillCircle(-6, 0, 1.7).fillCircle(6, 0, 1.7);
    face.lineStyle(1.7, 0x483044);
    for (const line of faceLines[expression]) {
      face.strokePoints(line.map(([x,y]) => ({x,y})));
    }
  }

  private person(x: number, y: number, shirt: number, skin: number, hair: number, name?: string, scale = 1) {
    const p = this.add.graphics();
    p.fillStyle(0x49354c,0.16).fillEllipse(0,1,43,10);
    p.fillStyle(0x483c5c).fillRoundedRect(-12,-20,10,19,4).fillRoundedRect(2,-20,10,19,4);
    p.fillStyle(shirt).fillRoundedRect(-17,-43,34,29,11).fillRoundedRect(-22,-39,9,21,4).fillRoundedRect(13,-39,9,21,4);
    p.fillStyle(hair).fillCircle(0,-57,19);
    p.fillStyle(skin).fillEllipse(0,-55,32,34);
    p.fillStyle(hair).fillEllipse(-3,-68,30,13).fillCircle(-13,-63,6);
    const face = this.add.graphics({y: -55});
    const actor = this.add.container(x,y,[p, face]).setScale(scale);
    this.faces.set(actor, face);
    this.drawFace(actor, 'neutral');
    if(name) {
      const label = this.add.text(0,-93,name,{fontFamily:'system-ui',fontSize:'11px',fontStyle:'bold',color:'#392c50',backgroundColor:'#fff8ed',padding:{x:7,y:3}}).setOrigin(0.5);
      actor.add(label);
    }
    return actor;
  }
}

export function Scene({lunch, action, motion}: {lunch: boolean; action?: SceneAction; motion: boolean}) {
  const state = useRef({action, motion});
  useEffect(() => { state.current = {action, motion}; }, [action, motion]);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO, parent: host.current, width: 720, height: 330,
      backgroundColor: '#bbdff1', scale: {mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH},
      scene: new SchoolScene(lunch, () => state.current), audio: {noAudio: true},
    });
    return () => game.destroy(true);
  }, [lunch]);

  return <div className="scene" ref={host} role="img" aria-label={lunch ? 'Illustrated lunchroom with Jo, classmates, and Mr. Lee' : 'Illustrated playground with Sam, classmates, and Ms. Rivera'} />;
}
