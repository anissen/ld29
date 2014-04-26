
package ludumdare;

import flambe.animation.Ease;
import flambe.Component;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.Entity;
import flambe.math.FMath;
import flambe.script.*;
import flambe.script.CallFunction;
import flambe.script.MoveTo;
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
        _sprite.scaleX.animateTo(0.75, 1, flambe.animation.Ease.bounceOut);
        _sprite.scaleY.animateTo(0.75, 1, flambe.animation.Ease.bounceOut);
        // _sprite.setScale(0.1);
        _sprite.disablePixelSnapping();
        _sprite.disablePointer();
        _sprite.centerAnchor();
    }

    override public function onUpdate (dt :Float) {
        if (_tile != null) {
            var tileSprite = _tile.get(FillSprite);
            _sprite.setXY(tileSprite.x._, tileSprite.y._);
        }
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
        // _moveToX = x;
        // _moveToY = y;
        _sprite.x.animateTo(x, Math.abs(x - _sprite.x._) / _moveSpeed, Ease.elasticInOut);
        _sprite.y.animateTo(y, Math.abs(y - _sprite.y._) / _moveSpeed, Ease.elasticInOut);
    }

    public function moveToTile (tile :Entity) {
        // if (_tile != null)
        //     _tile.removeChild(owner);
        // tile.addChild(owner);

        // _tileX = tileX;
        // _tileY = tileY;
        // _sprite.x.animateTo(tile.get(Sprite).x._, Math.abs(tile.get(Sprite).x._ - _sprite.x._) / _moveSpeed, Ease.elasticInOut);
        // _sprite.y.animateTo(tile.get(Sprite).y._, Math.abs(tile.get(Sprite).y._ - _sprite.y._) / _moveSpeed, Ease.elasticInOut);
        // _sprite.rotation.animateBy(360, 1, Ease.elasticInOut);
        // var tileSprite = tile.get(FillSprite);
        var tileSprite = tile.get(FillSprite);
        var distance = (Math.sqrt(Math.pow(tileSprite.x._ - _sprite.x._, 2) + Math.pow(tileSprite.y._ - _sprite.y._, 2))) / _moveSpeed;
        var moveScript = new Script();
        owner.add(moveScript);
        moveScript.run(new Sequence([
            new MoveTo(tileSprite.x._, tileSprite.y._, distance, Ease.elasticOut, Ease.elasticOut),
            new CallFunction(function () {
                _tile = tile;
                moveScript.dispose();
            })
        ]));
        _tile = null;

    }

    private var _ctx :GameContext;
    private var _name :String;
    private var _sprite :ImageSprite;
    private var _moveSpeed :Float = 300;
    // private var _rotationSpeed :Float = 10;
    private var _script :Script;
    private var _moveToX :Float;
    private var _moveToY :Float;
    public var _tile :Entity;
    // public var _tileX :Int;
    // public var _tileY :Int;
}
