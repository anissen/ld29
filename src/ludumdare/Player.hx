
package ludumdare;

import flambe.animation.Ease;
import flambe.Component;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.Entity;
import flambe.math.FMath;
import flambe.script.*;
import flambe.sound.Sound;
import flambe.sound.Playback;
import flambe.util.Signal1;
import flambe.display.EmitterSprite;

/** Logic for planes. */
class Player extends Component
{
    public function new (ctx :GameContext, name :String)
    {
        _ctx = ctx;
        _name = name;
    }

    override public function onAdded ()
    {
        var normal = _ctx.pack.getTexture(_name);
        _sprite = owner.get(ImageSprite);
        if (_sprite == null) {
            owner.add(_sprite = new ImageSprite(normal));
        }
        _sprite.texture = normal;
        _sprite.scaleX.animateTo(0.25, 1, flambe.animation.Ease.bounceOut);
        _sprite.scaleY.animateTo(0.25, 1, flambe.animation.Ease.bounceOut);
        // _sprite.setScale(0.1);
        _sprite.disablePixelSnapping();
        _sprite.centerAnchor();
    }

    override public function onUpdate (dt :Float) {
        
    }

    function playSound() {
        var params = new vault.SfxrParams();
        params.waveType = 0;
        params.squareDuty = 0.55555*0.6;
        params.startFrequency = 0.3 + 0.55555*0.3;
        params.slide = 0.1 + 0.55555*0.2;
        params.attackTime = 0.0;
        params.sustainTime = 0.1 + 0.55555*0.3;
        params.decayTime = 0.1 + 0.55555*0.2;
        params.masterVolume = 0.15;

        // taken from as3sfxr:
        //params = vault.SfxrParams.fromString("0,,0.2193,,0.4748,0.3482,,0.0691,,,,,,0.3482,,,,,1,,,,,0.5");
        var sfxr = new vault.Sfxr(params);
        sfxr.play();
    }

    public function move (x :Float, y :Float) {
        _moveToX = x;
        _moveToY = y;
    }

    private var _ctx :GameContext;
    private var _name :String;
    private var _sprite :ImageSprite;
    private var _moveSpeed :Float = 200;
    // private var _rotationSpeed :Float = 10;
    private var _script :Script;
    private var _moveToX :Float;
    private var _moveToY :Float;
}
