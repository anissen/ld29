
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

        var mouseDown = false;
        var startTileX :Float = 0; 
        var startTileY :Float = 0;
        // var colors = ["#7FDBFF", "#0074D9", "#001F3F", "#39CCCC", "#2ECC40", "#3D9970", "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#F012BE", "#B10DC9", "#85144B", "#dddddd", "#aaaaaa"];
        var emptyTexture = _ctx.pack.getTexture("tiles/empty");
        var textures = [_ctx.pack.getTexture("tiles/straight"), _ctx.pack.getTexture("tiles/bend")];
        var selection = new ImageSprite(_ctx.pack.getTexture("tiles/selection"));
        selection.centerAnchor();
        selection.disablePointer();

        for (y in 0...5) { // TODO: X and Y should be swapped for portrait mode
            for (x in 0...7) {
                var empty = Math.random() < 0.3;
                
                var texture = empty ? emptyTexture : textures[Math.floor(textures.length * Math.random())];
                var tileSprite = new ImageSprite(texture);
                tileSprite.centerAnchor();
                tileSprite.setXY(WIDTH / 2, HEIGHT / 2);
                tileSprite.x.animateTo(x * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);
                tileSprite.y.animateTo(y * TILE_SIZE + TILE_SIZE / 2, 1 + Math.random(), Ease.elasticOut);
                tileSprite.scaleX.animateTo(1.0, 1 + Math.random(), Ease.elasticOut);
                tileSprite.scaleY.animateTo(1.0, 1 + Math.random(), Ease.elasticOut);
                var rotations = [0.0, 90.0, 180.0, 270.0];
                tileSprite.rotation.animateTo(rotations[Math.floor(Math.random() * rotations.length)], 1 + Math.random(), Ease.elasticOut);
                // tileSprite.alpha._ = 0.9;
                //tileSprite.setBlendMode(flambe.display.BlendMode.Add);

                var entity = tiles[y][x];
                entity.add(tileSprite);
                // entity.add(new FillSprite(Math.floor(Math.random() * 0xFFFFFF), 128, 128));
                // entity.add(new WalkableTile());
                entity.add(new TileData(x, y));
                owner.addChild(entity);

                tileSprite.pointerDown.connect(function(event :PointerEvent) {
                    mouseDown = true;
                    startTileX = Math.floor(event.viewX / TILE_SIZE);
                    startTileY = Math.floor(event.viewY / TILE_SIZE);
                    selection.setXY(startTileX * TILE_SIZE + TILE_SIZE / 2, startTileY * TILE_SIZE + TILE_SIZE / 2);
                    selection.scaleX.animateTo(1.0, 0.5, Ease.elasticOut);
                    selection.scaleY.animateTo(1.0, 0.5, Ease.elasticOut);
                    selection.alpha.animateTo(1.0, 0.5, Ease.elasticOut);
                });
                tileSprite.pointerUp.connect(function(event :PointerEvent) {
                    if (!mouseDown) return;
                    selection.scaleX.animateTo(0.0, 0.5, Ease.elasticOut);
                    selection.scaleY.animateTo(0.0, 0.5, Ease.elasticOut);
                    selection.alpha.animateTo(0.0, 0.5, Ease.elasticOut);

                    mouseDown = false;
                    var tileX = Math.floor(event.viewX / TILE_SIZE);
                    var tileY = Math.floor(event.viewY / TILE_SIZE);
                    if (Math.abs(tileX - startTileX) == 0 && Math.abs(tileY - startTileY) == 0) {
                        // TODO: particle effect?
                        if (empty) return;
                        var player = playerEntity.get(Player);
                        if (player._tile == null) return;
                        var playerTileData = player._tile.get(TileData);
                        var playerTileX = playerTileData.tileX;
                        var playerTileY = playerTileData.tileY;
                        var playerSprite = playerEntity.get(Sprite);
                        if (Math.abs(playerTileX - tileX) + Math.abs(playerTileY - tileY) == 1) {
                            player.moveToTile(tileSprite.owner);
                        }
                        return;
                    }
                    if (Math.abs(tileX - startTileX) != 0 && Math.abs(tileY - startTileY) != 0) return;
                    if (Math.abs(tileX - startTileX) != 0) {
                        moveRow(tileY, tileX - startTileX);
                    } else if (Math.abs(tileY - startTileY) != 0) {
                        moveColumn(tileX, tileY - startTileY);
                    }
                });
            }
        }

        owner.addChild(new Entity().add(selection));

        // Create the player's plane
        var player = new Player(_ctx, "player/player");
        playerEntity = new Entity().add(player);
        // playerEntity.get(Sprite).setXY(TILE_SIZE / 2, TILE_SIZE / 2);
        owner.addChild(playerEntity);

        player.moveToTile(tiles[2][2]);
    }

    override public function onUpdate (dt :Float) {
        
    }

    function getColumn(index :Int) {
        var column = new Array<Entity>();
        for (row in tiles) {
            column.push(row[index]);
        }
        return column;
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
            var tileData = tile.get(TileData);
            tileData.tileX = count;
            var sprite = tile.get(ImageSprite);
            sprite.x.animateTo(count * TILE_SIZE + TILE_SIZE / 2, 1, Ease.elasticOut);
            count++;
        }
        var shakeScript = new Script();
        owner.add(shakeScript);
        shakeScript.run(new Shake(2, 2, 0.3));
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
            var tileData = tile.get(TileData);
            tileData.tileY = y;
            var sprite = tile.get(ImageSprite);
            sprite.y.animateTo(y * TILE_SIZE + TILE_SIZE / 2, 1, Ease.elasticOut);
            tiles[y][index] = tile;
        }
        var shakeScript = new Script();
        owner.add(shakeScript);
        shakeScript.run(new Shake(2, 2, 0.3));
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

    private var _ctx :GameContext;
    private var _name :String;
    private var _file :String;
    private var _moveSpeed :Float = 200;
    // private var _rotationSpeed :Float = 10;

    private var TILE_SIZE :Int;
    private var HEIGHT :Int;
    private var WIDTH :Int;

    private var tiles :Array<Array<Entity>>;

    public var _engineSoundPlayback :Playback;

    public var playerEntity (default, null) :Entity;

    //private var _moveListener :flambe.System.Sig;
    public var onMoveStart :Signal1<Entity> = new Signal1<Entity>();
    public var onMoveStop :Signal1<Entity> = new Signal1<Entity>();
}
