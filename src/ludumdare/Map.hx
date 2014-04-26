
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

/** Logic for planes. */
class Map extends Component
{
    public function new (ctx :GameContext, file :String, tileSize :Int, width :Int, height :Int)
    {
        _ctx = ctx;
        _file = file;
        TILE_SIZE = tileSize;
        WIDTH = width;
        HEIGHT = height;
    }

    override public function onAdded ()
    {
        tiles = [
            for (y in 0...5) [ 
                for (x in 0...7)
                    new Entity() 
            ]
        ];
        // trace("length of tiles: " + tiles.length);

        for (y in 0...5) { // TODO: X and Y should be swapped for portrait mode
            for (x in 0...7) {
                var tileSprite = new FillSprite(Math.floor(Math.random() * 0xFFFFFF), TILE_SIZE, TILE_SIZE);
                tileSprite.centerAnchor();
                tileSprite.setXY(WIDTH / 2, HEIGHT / 2);
                tileSprite.x.animateTo(x * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);
                tileSprite.y.animateTo(y * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);

                var movingTile = false;
                var startX :Float = 0; 
                var startY :Float = 0; 
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
                    // trace(haxe.Timer.stamp());
                    // moveRow(y, -1);
                    // moveColumn(x, -1);
                });
                tileSprite.pointerUp.connect(function(_) {
                    movingTile = false;
                    var tileX = Math.floor(tileSprite.x._ / TILE_SIZE);
                    var tileY = Math.floor(tileSprite.y._ / TILE_SIZE);
                    var newX :Int = Math.floor((tileX + 0.5) * TILE_SIZE);
                    var newY :Int = Math.floor((tileY + 0.5) * TILE_SIZE);
                    trace("diff x", Math.abs(newX - startX));
                    trace("diff y", Math.abs(newY - startY));
                    if (Math.abs(newX - startX) > TILE_SIZE / 2) {
                        moveRow(tileY, newX - startX);
                    } else if (Math.abs(newY - startY) > TILE_SIZE / 2) {
                        moveColumn(tileX, newY - startY);
                    } else {
                        tileSprite.x.animateTo(newX, 0.5, Ease.elasticOut);
                        tileSprite.y.animateTo(newY, 0.5, Ease.elasticOut);
                    }
                });
                tileSprite.pointerMove.connect(function(event :PointerEvent) {
                    if (!movingTile) return;
                    var diffX = event.viewX - startX;
                    var diffY = event.viewY - startY;
                    if (Math.abs(diffX) > Math.abs(diffY)) {
                        tileSprite.setXY(FMath.clamp(event.viewX, startX - TILE_SIZE, startX + TILE_SIZE), startY);
                    } else {
                        tileSprite.setXY(startX, FMath.clamp(event.viewY, startY - TILE_SIZE, startY + TILE_SIZE));
                    }
                });
                var entity = tiles[y][x];
                owner.addChild(entity.add(tileSprite));
            }
        }
    }

    override public function onUpdate (dt :Float) {
        
    }

    // function moveRow(index :Int, direction :Int) {
    //     var arr = tile[index];
    //     for (x in 0...tiles[index].length) {
    //         tile[index] = arr[(index + arr.length + direction) % arr.length];
    //         var sprite = tile.get(FillSprite);
    //         sprite.x.animateTo(direction * TILE_SIZE, 2, Ease.elasticOut);
    //     }
    // }

    function getRow(index :Int) {
        
    }

    function moveRow(index :Int, direction :Float) {
        var row = tiles[index];
        if (direction > 0) {
            row.unshift(row.pop());
        } else if (direction < 0) {
            row.push(row.shift());
        }
        var count = 0;
        for (tile in row) {
            var sprite = tile.get(FillSprite);
            sprite.x.animateTo(count * TILE_SIZE + TILE_SIZE / 2, 2, Ease.elasticOut);
            count++;
        }
    }

    function moveColumn(index :Int, direction :Float) {
        var column = new Array<Entity>();
        for (row in tiles) {
            column.push(row[index]);
        }
        if (direction > 0) {
            column.unshift(column.pop());
        } else if (direction < 0) {
            column.push(column.shift());
        }
        for (y in 0...column.length) {
            var tile = column[y];
            var sprite = tile.get(FillSprite);
            sprite.y.animateTo(y * TILE_SIZE + TILE_SIZE / 2, 2, Ease.elasticOut);
            tiles[y][index] = tile;
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
        _moveToX = x;
        _moveToY = y;
    }

    private var _ctx :GameContext;
    private var _name :String;
    private var _file :String;
    private var _sprite :ImageSprite;
    private var _moving :Bool = false;
    private var _landing :Bool = false;
    private var _landed :Bool = false;
    private var _landingOn :Entity;
    private var _initialPlanetRotation :Float;
    private var _moveSpeed :Float = 200;
    // private var _rotationSpeed :Float = 10;
    private var _script :Script;
    private var _moveToX :Float;
    private var _moveToY :Float;
    private var _emitter :EmitterSprite;

    private var TILE_SIZE :Int;
    private var HEIGHT :Int;
    private var WIDTH :Int;

    private var tiles :Array<Array<Entity>>;

    public var _engineSoundPlayback :Playback;

    //private var _moveListener :flambe.System.Sig;
    public var onMoveStart :Signal1<Entity> = new Signal1<Entity>();
    public var onMoveStop :Signal1<Entity> = new Signal1<Entity>();
}
