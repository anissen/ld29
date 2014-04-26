
package ludumdare;

import flambe.animation.Ease;
import flambe.Component;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.Entity;
import flambe.input.PointerEvent;
import flambe.math.FMath;
import flambe.script.*;
import flambe.sound.Sound;
import flambe.sound.Playback;
import flambe.util.Signal1;
import flambe.display.EmitterSprite;

class Tile extends Component
{
    public function new (width :Int, height :Int)
    {
        _width = width;
        _height = height;
    }

    override public function onAdded ()
    {
        var tileSprite = new FillSprite((empty ? 0x000000 : Math.floor(Math.random() * 0xFFFFFF)), TILE_SIZE, TILE_SIZE);
        tileSprite.centerAnchor();
        tileSprite.setXY(WIDTH / 2, HEIGHT / 2);
        tileSprite.x.animateTo(x * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);
        tileSprite.y.animateTo(y * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);
        tileSprite.scaleX.animateTo(1.0, 1 + Math.random(), Ease.elasticOut);
        tileSprite.scaleY.animateTo(1.0, 1 + Math.random(), Ease.elasticOut);

        var movingTile = false;
        var startX :Float = 0;
        var startY :Float = 0;
        // var startTime :Int = 0;
        // tileSprite.pointerIn.connect(function(event :PointerEvent) {
        //     tileSprite.scaleX.animateTo(1.1, 0.5, Ease.elasticOut);
        //     tileSprite.scaleY.animateTo(1.1, 0.5, Ease.elasticOut);
        // });
        // tileSprite.pointerOut.connect(function(event :PointerEvent) {
        //     tileSprite.scaleX.animateTo(1.0, 0.5, Ease.elasticOut);
        //     tileSprite.scaleY.animateTo(1.0, 0.5, Ease.elasticOut);
        // });
        tileSprite.pointerDown.connect(function(event :PointerEvent) {
            movingTile = true;
            startX = (Math.floor(event.viewX / TILE_SIZE) + 0.5) * TILE_SIZE;
            startY = (Math.floor(event.viewY / TILE_SIZE) + 0.5) * TILE_SIZE;
            // startTime = haxe.Timer.stamp();
            trace(haxe.Timer.stamp());
        });
        tileSprite.pointerUp.connect(function(_) {
            movingTile = false;
            tileSprite.x.animateTo((Math.floor(tileSprite.x._ / TILE_SIZE) + 0.5) * TILE_SIZE, 0.5);
            tileSprite.y.animateTo((Math.floor(tileSprite.y._ / TILE_SIZE) + 0.5) * TILE_SIZE, 0.5);
        });
        tileSprite.pointerMove.connect(function(event :PointerEvent) {
            if (!movingTile) return;
            var diffX = event.viewX - startX;
            var diffY = event.viewY - startY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                moveRow(y, diffX);
            } else {
                tileSprite.setXY(startX, event.viewY);
            }
            // var differenceTime:Float = (Lib.getTimer () - mouseDownTime) / 1000
        });
        var entity = tiles[y][x];
        owner.addChild(entity.add(tileSprite));
    }

    private var _width :Int;
    private var _height :Int;
}
