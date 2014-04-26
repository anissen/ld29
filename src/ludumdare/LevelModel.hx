
package ludumdare;

import flambe.Component;
import flambe.display.FillSprite;
import flambe.Entity;
import flambe.input.PointerEvent;
import flambe.math.Point;
import flambe.script.Parallel;
import flambe.SpeedAdjuster;
import flambe.System;
import flambe.animation.Ease;
import flambe.display.ImageSprite;
import flambe.display.PatternSprite;
import flambe.display.Sprite;
import flambe.math.FMath;
import flambe.script.*;
import flambe.animation.AnimatedFloat;
import flambe.util.Value;
import flambe.display.TextSprite;
import flambe.display.Font;
import flambe.display.EmitterMold;
import flambe.display.EmitterSprite;

class LevelModel extends Component
{
    public function new (ctx :GameContext)
    {
        _ctx = ctx;
        _zoom = new AnimatedFloat(1);
    }

    override public function onAdded ()
    {
        _worldLayer = new Entity();
        _worldLayer.add(new Sprite().centerAnchor()); // Dummy sprite to be able to scale the entire scene
        owner.addChild(_worldLayer);

        // Add a scrolling ocean background
        var background = new FillSprite(0xFFFFAA, WIDTH, HEIGHT);
        background.centerAnchor();
        background.setXY(WIDTH / 2, HEIGHT / 2);
        _worldLayer.addChild(new Entity().add(background));
        _worldLayer.addChild(_mapLayer = new Entity());
        _worldLayer.addChild(_playerLayer = new Entity());

        var map = new Map(_ctx, "dummy_file", TILE_SIZE, WIDTH, HEIGHT);
        _mapLayer.addChild(new Entity().add(map));

        // Create the player's plane
        var player = new Player(_ctx, "player/player");
        playerEntity = new Entity().add(player);
        playerEntity.get(Sprite).setXY(System.stage.width / 2, System.stage.height / 2);
        player.move(System.stage.width / 2, System.stage.height / 2);

        _playerLayer.addChild(playerEntity);

        // plane.onMoveStart.connect(function(_) {
        //     _moving = true;
        //     _zoom.animateTo(1, 5, flambe.animation.Ease.quadInOut);
        // });

        // plane.onMoveStop.connect(function(_) {
        //     _moving = false;
        //     _zoom.animateTo(4, 5, flambe.animation.Ease.quadInOut);
        // });

        // _ctx.pack.getSound("music/Coel_Healy_Kep").loop(1);

        // speak("System operational");
    }

    private function speak (text :String) {
        #if js
        js.Lib.eval("speak('" + text + "', 33)");
        #end
    }

    private function onPlanetMouseEnter (event :PointerEvent) {
        trace("Entered planet " + event.hit.name);
    }

    private function onPlanetMouseLeave (event :PointerEvent) {
        trace("Left planet " + event.hit.name);
    }

    private function onPlanetMouseClick (event :PointerEvent) {
        var planet = event.hit.owner;
        trace("Clicked planet " + event.hit.name);

        // speak("Moving to " + planet.get(Planet).planetName);
    }

    override public function onUpdate (dt :Float)
    {
        // var playerSprite = player.get(Sprite);
        // var worldSprite = _worldLayer.get(Sprite);

        // if (System.mouse.isDown(flambe.input.MouseButton.Left)) {
        //     var pointerX = worldSprite.anchorX._ + System.mouse.x * (1 / _zoom._);
        //     var pointerY = worldSprite.anchorY._ + System.mouse.y * (1 / _zoom._);
        //     var spaceship = player.get(Player);
        //     spaceship.move(pointerX, pointerY);
        // }
        // _zoom.update(dt);
        // // _zoom._ = FMath.clamp(_zoom._ + (_moving ? -2 * dt : 2 * dt), 0.7, 2);
        // worldSprite
        //     .setScale(_zoom._)
        //     .setAnchor(playerSprite.x._ - (System.stage.width / 2) / _zoom._, playerSprite.y._ - (System.stage.height / 2) / _zoom._);
    }

    private var _ctx :GameContext;

    private var _worldLayer  :Entity;
    private var _mapLayer  :Entity;
    private var _playerLayer  :Entity;
    private var _zoom :AnimatedFloat;
    private var _moving :Bool = false;
    private static var TILE_SIZE :Int = 128;
    private static var HEIGHT :Int = TILE_SIZE * 5; // 640;
    private static var WIDTH :Int = TILE_SIZE * 7; //approx. 960;
    public var playerEntity (default, null) :Entity;
}
