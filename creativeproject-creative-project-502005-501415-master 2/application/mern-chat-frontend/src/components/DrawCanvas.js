// Main sources used: 
// https://youtu.be/-AwG8yF06Po <-- Using canvas to draw images in React
// https://youtu.be/yP5DKzriqXA <-- Building overall game mechanics
// https://www.pluralsight.com/guides/event-listeners-in-react-components <-- How to get keyboard inputs with React
// https://limezu.itch.io/serenevillagerevamped <-- Area sprites / images
// https://limezu.itch.io/moderninteriors <-- Character sprites / images

// Music / Sounds Used
// Attack SFX from Undertale
// Battle Themes: Yu-Gi-Oh! (God's Anger), Final Fantasy 7 (One Winged Angel), Disgaea 2 (Spread Your Wings), JoJo's Bizarre Adventure (Avalon)
// Run SFX from Pokemon Red / Blue  
// Chat Music: The Legend of Zelda: Windwaker (House Theme)
// Overworld Music: The Legend of Zelda: Windwaker (The Great Sea)

import React, {useEffect, useRef, useState, useContext} from 'react';
import { AppContext } from '../context/appContext';

// Import area images
import startArea from './game/images/Areas/Starting_Area/Starting_Area_Map.png'
import battleArea from './game/images/Areas/Battle/Battle_Background.png'

// Import left sprites
import Guy_Left_0 from './game/images/Guy/Left/Guy_Left_0.png'
import Guy_Left_1 from './game/images/Guy/Left/Guy_Left_1.png'
import Guy_Left_2 from './game/images/Guy/Left/Guy_Left_2.png'
import Guy_Left_3 from './game/images/Guy/Left/Guy_Left_3.png'
import Guy_Left_4 from './game/images/Guy/Left/Guy_Left_4.png'
import Guy_Left_5 from './game/images/Guy/Left/Guy_Left_5.png'
import Guy_Left_6 from './game/images/Guy/Left/Guy_Left_6.png'

// Import right sprites
import Guy_Right_0 from './game/images/Guy/Right/Guy_Right_0.png'
import Guy_Right_1 from './game/images/Guy/Right/Guy_Right_1.png'
import Guy_Right_2 from './game/images/Guy/Right/Guy_Right_2.png'
import Guy_Right_3 from './game/images/Guy/Right/Guy_Right_3.png'
import Guy_Right_4 from './game/images/Guy/Right/Guy_Right_4.png'
import Guy_Right_5 from './game/images/Guy/Right/Guy_Right_5.png'
import Guy_Right_6 from './game/images/Guy/Right/Guy_Right_6.png'

// Import down sprites
import Guy_Down_0 from './game/images/Guy/Down/Guy_Down_0.png'
import Guy_Down_1 from './game/images/Guy/Down/Guy_Down_1.png'
import Guy_Down_2 from './game/images/Guy/Down/Guy_Down_2.png'
import Guy_Down_3 from './game/images/Guy/Down/Guy_Down_3.png'
import Guy_Down_4 from './game/images/Guy/Down/Guy_Down_4.png'
import Guy_Down_5 from './game/images/Guy/Down/Guy_Down_5.png'
import Guy_Down_6 from './game/images/Guy/Down/Guy_Down_6.png'

// Import up sprites
import Guy_Up_0 from './game/images/Guy/Up/Guy_Up_0.png'
import Guy_Up_1 from './game/images/Guy/Up/Guy_Up_1.png'
import Guy_Up_2 from './game/images/Guy/Up/Guy_Up_2.png'
import Guy_Up_3 from './game/images/Guy/Up/Guy_Up_3.png'
import Guy_Up_4 from './game/images/Guy/Up/Guy_Up_4.png'
import Guy_Up_5 from './game/images/Guy/Up/Guy_Up_5.png'
import Guy_Up_6 from './game/images/Guy/Up/Guy_Up_6.png'

// Import enemy sprite(s)
import Todd from './game/images/Enemies/Todd.png'
import Jeremy from './game/images/Enemies/Jeremy.png'
import Dave from './game/images/Enemies/Dave.png'
import Jonathan from './game/images/Enemies/Jonathan.png'

// Import variables and functions that were moved to reduce clutter
import { collisions } from './game/data/collisions';
import { battleZonesData } from './game/data/battlezone';
import { doors } from './game/data/doors';

// Import audio
import Muted from './game/images/UI/Muted.png'
import Sound from './game/images/UI/Sound_On.png'

import AttackHit from './game/audio/Attack.mp3'
import Chat from './game/audio/Chat.mp3'
import Overworld from './game/audio/Overworld.mp3'
import Battle1 from './game/audio/Battle_1.mp3'
import Battle2 from './game/audio/Battle_2.mp3'
import Battle3 from './game/audio/Battle_3.mp3'
import Battle4 from './game/audio/Battle_4.mp3'
import RunSfx from './game/audio/Run.mp3'
import { Howl } from 'howler';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";


function DrawCanvas() {
    //User Check
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Background image position
    const [imageX, setLocX] = useState(-650);
    const [imageY, setLocY] = useState(-550);

    // Background image 
    const [image, setImage] = useState(null);
    const [battleImage, setBattleImage] = useState(null);

    // Player
    const [playerImage, setPlayerImage] = useState(null);
    const [playerImageWidth, setPlayerImageWidth] = useState(null);
    const [playerImageHeight, setPlayerImageHeight] = useState(null);
    const [playerHP, setPlayerHP] = useState(null);

    // Player movement
    const [playerUp, setUp] = useState(null);
    const [playerDown, setDown] = useState(null);
    const [playerLeft, setLeft] = useState(null);
    const [playerRight, setRight] = useState(null);
    const [gameFrame, setGameFrame] = useState(0);
    const [moveFrame, setFrame] = useState(0);
    const [lastKey, setLastKey] = useState(null);
    const [canMove, setMove] = useState(true); // Checks for collision

    // Chatroom
    const [chatting, setChatStatus] = useState(false); // Checks if you are in chat room (house) or overworld

    // Battles
    const [battleActive, setBattle] = useState(false); // Checks if battle is going on
    const [battleStart, setBattleStart] = useState(false); // Checks for battle activation
    const [battleEnd, setBattleEnd] = useState(false); // Checks for end of battle to transition back to overworld
    const [battleText, setBattleText] = useState(''); // Entire chat log of battle
    const [battleChance, setBattleChance] = useState(0); // Ensures you don't immediately run into another battle afterwards
    // Opacity control for Battle UI
    const [transOpacity, setOpacity] = useState(0);
    const [menuOpacity, setOpacityMenu] = useState(0);
    // Enemies
    const [enemyImage, setEnemyImage] = useState(null);
    const [enemyHP, setEnemyHP] = useState(null);
    const [toddImage, setToddImage] = useState(null);
    const [jeremyImage, setJeremyImage] = useState(null);
    const [jonImage, setJonImage] = useState(null);
    const [daveImage, setDaveImage] = useState(null);

    // Audio UI
    const [speakerImage, setSpeakerImage] = useState(Muted); // Default = Muted
    const [speakerState, setSpeakerState] = useState(false); // False = Muted, True = Volume On

    // Music Tracks
    const [overworld_theme, setOTheme] = useState(null);
    const [chat_theme, setCTheme] = useState(null);
    const [attackSfx, setA] = useState(null);
    const [RunSound, setR] = useState(null);
    const [battle_theme_1, setBTheme1] = useState(null);
    const [battle_theme_2, setBTheme2] = useState(null);
    const [battle_theme_3, setBTheme3] = useState(null);
    const [battle_theme_4, setBTheme4] = useState(null);

    // Audio Manager
    const [currAudio, setCurrAudio] = useState(null);

    // Canvas references
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    // Citation start: https://youtu.be/yP5DKzriqXA
    class Bounds
    {
        static width = 64
        static height = 64
        constructor({position}) 
        {
            this.position = position
            this.width = 64
            this.height = 64
        }
    }

    const collisionsMap = []
    const boundaries = []
    const battleZonesMap = []
    const battleZones = []
    const doorsMap = []
    const doorZones = []
    const doorSymbols = []
    const offset = 
    {
        x: -650,
        y: -550
    }
    // Citation END

    // 'Colliders' of interactables (walls, doors, and grass)
    const [collisionArray, setCollision] = useState(boundaries);
    const [battleZoneArray, setBattleZones] = useState(battleZones);
    const [doorsArray, setDoors] = useState(doorZones);
    const [doorsType] = useState(doorSymbols);

    const {socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom,gameRoom, setgameRoom} = useContext(AppContext);

    //function to send user to chat
    function handleDoorEntrance(roomName){
        if (!user){
            return alert('Please login');
        }else{
            setCurrentRoom(roomName);
            setgameRoom(roomName);
            navigate("/chat");
        }
    }

    // Citation start: https://youtu.be/-AwG8yF06Po
    useEffect(() => {
        // Enemies
        const todd = new Image();
        todd.src = Todd;
        todd.onload = (() => setToddImage(todd));

        const dave = new Image();
        dave.src = Dave;
        dave.onload = (() => setDaveImage(dave));

        const jon = new Image();
        jon.src = Jonathan;
        jon.onload = (() => setJonImage(jon));

        const jeremy = new Image();
        jeremy.src = Jeremy;
        jeremy.onload = (() => setJeremyImage(jeremy));

        // Movement sprites (Up)
        let upArr = []
        const person_up_0 = new Image();
        person_up_0.src = Guy_Up_0;
        person_up_0.onload = (() => upArr.push(person_up_0));
        const person_up_1 = new Image();
        person_up_1.src = Guy_Up_1;
        person_up_1.onload = (() => upArr.push(person_up_1));
        const person_up_2 = new Image();
        person_up_2.src = Guy_Up_2;
        person_up_2.onload = (() => upArr.push(person_up_2));
        const person_up_3 = new Image();
        person_up_3.src = Guy_Up_3;
        person_up_3.onload = (() => upArr.push(person_up_3));
        const person_up_4 = new Image();
        person_up_4.src = Guy_Up_4;
        person_up_4.onload = (() => upArr.push(person_up_4));
        const person_up_5 = new Image();
        person_up_5.src = Guy_Up_5;
        person_up_5.onload = (() => upArr.push(person_up_5));
        const person_up_6 = new Image();
        person_up_6.src = Guy_Up_6;
        person_up_6.onload = (() => {
            upArr.push(person_up_6);
            setUp(upArr);
        });

        // Movement sprites (Down)
        let downArr = []
        const person_down_0 = new Image();
        person_down_0.src = Guy_Down_0;
        person_down_0.onload = (() => downArr.push(person_down_0));
        const person_down_1 = new Image();
        person_down_1.src = Guy_Down_1;
        person_down_1.onload = (() => downArr.push(person_down_1));
        const person_down_2 = new Image();
        person_down_2.src = Guy_Down_2;
        person_down_2.onload = (() => downArr.push(person_down_2));
        const person_down_3 = new Image();
        person_down_3.src = Guy_Down_3;
        person_down_3.onload = (() => downArr.push(person_down_3));
        const person_down_4 = new Image();
        person_down_4.src = Guy_Down_4;
        person_down_4.onload = (() => downArr.push(person_down_4));
        const person_down_5 = new Image();
        person_down_5.src = Guy_Down_5;
        person_down_5.onload = (() => downArr.push(person_down_5));
        const person_down_6 = new Image();
        person_down_6.src = Guy_Down_6;
        person_down_6.onload = (() => {
            downArr.push(person_down_6);
            setDown(downArr);
        });

        // Movement sprites (Left)
        let leftArr = []
        const person_left_0 = new Image();
        person_left_0.src = Guy_Left_0;
        person_left_0.onload = (() => leftArr.push(person_left_0));
        const person_left_1 = new Image();
        person_left_1.src = Guy_Left_1;
        person_left_1.onload = (() => leftArr.push(person_left_1));
        const person_left_2 = new Image();
        person_left_2.src = Guy_Left_2;
        person_left_2.onload = (() => leftArr.push(person_left_2));
        const person_left_3 = new Image();
        person_left_3.src = Guy_Left_3;
        person_left_3.onload = (() => leftArr.push(person_left_3));
        const person_left_4 = new Image();
        person_left_4.src = Guy_Left_4;
        person_left_4.onload = (() => leftArr.push(person_left_4));
        const person_left_5 = new Image();
        person_left_5.src = Guy_Left_5;
        person_left_5.onload = (() => leftArr.push(person_left_5));
        const person_left_6 = new Image();
        person_left_6.src = Guy_Left_6;
        person_left_6.onload = (() => {
            leftArr.push(person_left_6);
            setLeft(leftArr);
        });

        // Movement sprites (Right)
        let rightArr = []
        const person_right_0 = new Image();
        person_right_0.src = Guy_Right_0;
        person_right_0.onload = (() => rightArr.push(person_right_0));
        const person_right_1 = new Image();
        person_right_1.src = Guy_Right_1;
        person_right_1.onload = (() => rightArr.push(person_right_1));
        const person_right_2 = new Image();
        person_right_2.src = Guy_Right_2;
        person_right_2.onload = (() => rightArr.push(person_right_2));
        const person_right_3 = new Image();
        person_right_3.src = Guy_Right_3;
        person_right_3.onload = (() => rightArr.push(person_right_3));
        const person_right_4 = new Image();
        person_right_4.src = Guy_Right_4;
        person_right_4.onload = (() => rightArr.push(person_right_4));
        const person_right_5 = new Image();
        person_right_5.src = Guy_Right_5;
        person_right_5.onload = (() => rightArr.push(person_right_5));
        const person_right_6 = new Image();
        person_right_6.src = Guy_Right_6;
        person_right_6.onload = (() => {
            rightArr.push(person_right_6);
            setRight(rightArr);
        });

        // Initialize all audio sources once
        const over = new Howl({
            src: Overworld,
            loop: true
        });

        // Default track is overworld theme when in overworld
        over.on('load', function () {
                setCurrAudio(over)
                setOTheme(over);
            }
        )

        const chat = new Howl({
            src: Chat,
            loop: true
        });

        chat.on('load', setCTheme(chat))

        const attack = new Howl({
            src: AttackHit
        });

        attack.on('load', setA(attack))

        const battle_1 = new Howl({
            src: Battle1,
            loop: true
        });

        battle_1.on('load', setBTheme1(battle_1))

        const battle_2 = new Howl({
            src: Battle2,
            loop: true
        });

        battle_2.on('load', setBTheme2(battle_2))

        const battle_3 = new Howl({
            src: Battle3,
            loop: true
        });

        battle_3.on('load', setBTheme3(battle_3))

        const battle_4 = new Howl({
            src: Battle4,
            loop: true
        });

        battle_4.on('load', setBTheme4(battle_4))

        const run = new Howl({
            src: RunSfx
        });

        run.on('load', setR(run));

        // Create Image objects for area 
        const startBG = new Image();
        startBG.src = startArea;
        startBG.onload = (() => {
            setImage(startBG);
        })

        setPlayerImage(person_down_0);
        setPlayerImageHeight(person_left_0.height);
        setPlayerImageWidth(person_left_0.width);

        const battleBG = new Image();
        battleBG.src = battleArea;
        battleBG.onload = (() => {
            setBattleImage(battleBG);
        })
        // Citation END

        // Citation start: https://youtu.be/yP5DKzriqXA
        // Initialize collisions
        for (let i = 0; i < collisions.length; i += 70)
        {
            collisionsMap.push(collisions.slice(i, i + 70))
        }
        collisionsMap.forEach((row,i) => 
        {
            row.forEach((symbol,j) => 
            {
                if (symbol === 113)
                {
                    boundaries.push(
                    new Bounds({
                        position: {
                            x : j * Bounds.width + offset.x,
                            y : i * Bounds.height + offset.y
                    }}))
                }  
            })
        })

        // Initialize battle zones
        for (let i = 0; i < battleZonesData.length; i += 70)
        {
            battleZonesMap.push(battleZonesData.slice(i, i + 70))
        }
        battleZonesMap.forEach((row,i) => {
            row.forEach((symbol,j) => {
                if (symbol === 91){
                    battleZones.push(
                    new Bounds({
                        position: {
                            x : j * Bounds.width + offset.x,
                            y : i * Bounds.height + offset.y
                    }}))
                }
                
            })
        })

        // Initialize doors / entrances to chat rooms
        for (let i = 0; i < doors.length; i += 70)
        {
            doorsMap.push(doors.slice(i, i + 70))
        }
        doorsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 881 || symbol === 882 || symbol === 900 || symbol === 901 || symbol === 938)
                {
                    doorSymbols.push(symbol)
                    doorZones.push(
                        new Bounds({
                            position: {
                                x : j * Bounds.width + offset.x,
                                y : i * Bounds.height + offset.y
                        }}))
                }
            })
        })
        // Citation END
        
    }, []);

    // Citation start: https://youtu.be/-AwG8yF06Po
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        contextRef.current = context;
        setgameRoom("general");

        if (image)
        {
            if (battleActive || chatting)
            {
                if (!battleStart && !chatting)
                {
                    // Battle has started
                    context.drawImage(battleImage, 0, 0)
                    context.drawImage(enemyImage, canvas.width / 2 - enemyImage.width / 2, 50)

                    if (speakerState)
                    {
                        currAudio.mute(false);
                    }
                }
            }
            else
            {
                // Draw Background (bottom layer)
                context.drawImage(image, imageX, imageY);

                // Debug (Draw Collisions for walls, doors, and battlezones)
                // collisionArray.forEach((boundary) =>
                // {
                //     context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
                // })
                // battleZoneArray.forEach((battleZone) => 
                // {
                //     context.fillRect(battleZone.position.x, battleZone.position.y, battleZone.width, battleZone.height)
                // }) 
                // doorsArray.forEach((door) => 
                // {
                //     context.fillRect(door.position.x, door.position.y, door.width, door.height)
                // })

                // Draw Player (topmost layer)
                context.drawImage(playerImage, 400, 300);
            }
        }

        // Fade to black when battle has been triggered or you enter a door
        if (battleStart)
        {
            if (transOpacity < 1)
            {
                setOpacity(transOpacity + 0.00025)
            }
            else
            {
                setOpacity(1);
                context.clearRect(0, 0, canvas.width, canvas.height);
                setBattleStart(false); // Battle no longer has started and now it is time to fight
                setBattleEnd(false); // Battle has ended
                setFrame(0);
                setGameFrame(0);
                setBattleChance(0);
                if (speakerState)
                {
                    currAudio.play();
                }
            }
        }
        else // Fade out when you exit door / chatroom or battle finishes
        {
            if (transOpacity > 0)
            {
                setOpacity(transOpacity - 0.00025)
                if (battleActive)
                {
                    setOpacityMenu(menuOpacity + 0.00025)
                }
            }
            else
            {
                setOpacity(0);
            }
        }

        if (chatting)
        {
            if (transOpacity < 1)
            {
                setOpacity(transOpacity + 0.00025)
            }
            else
            {
                setOpacity(1);
            }

            if (!currAudio.playing() && speakerState)
            {
                currAudio.play();
            }
        }

        // If battle is active and you choose to end it (run or defeat enemy)
        if (battleActive && battleEnd)
        {
            if (transOpacity < 1)
            {
                setOpacity(transOpacity + 0.00025);
                setOpacityMenu(menuOpacity - 0.00025);
            }
            else
            {
                setOpacity(1);
                setOpacityMenu(0);
                setBattleEnd(false); // battle has finished ending
                setBattle(false);
                setBattleChance(0);
                if (speakerState)
                {
                    currAudio.play();
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [image, battleStart, chatting, battleActive, battleEnd, battleImage, enemyImage, imageX, imageY, playerImage, transOpacity, menuOpacity]);
    // Citation END

    function updateCollisions(direction)
    {
        let arr = collisionArray
        arr.forEach((boundary) =>
        {
            switch (direction)
            {
                case "Up":
                    boundary.position.y += 10;
                    break;
                case "Down":
                    boundary.position.y -= 10;
                    break;
                case "Left":
                    boundary.position.x += 10;
                    break;
                case "Right":
                    boundary.position.x -= 10;
                    break;
                default:
                    break;
            }
        })
        setCollision(arr);
    }

    function updateBattleZones(direction)
    {
        let arr = battleZoneArray
        arr.forEach((boundary) =>
        {
            switch (direction)
            {
                case "Up":
                    boundary.position.y += 10;
                    break;
                case "Down":
                    boundary.position.y -= 10;
                    break;
                case "Left":
                    boundary.position.x += 10;
                    break;
                case "Right":
                    boundary.position.x -= 10;
                    break;
                default:
                    break;
            }
        })
        setBattleZones(arr);
    }

    function updateDoors(direction)
    {
        let arr = doorsArray
        arr.forEach((boundary) =>
        {
            switch (direction)
            {
                case "Up":
                    boundary.position.y += 10;
                    break;
                case "Down":
                    boundary.position.y -= 10;
                    break;
                case "Left":
                    boundary.position.x += 10;
                    break;
                case "Right":
                    boundary.position.x -= 10;
                    break;
                default:
                    break;
            }
        })
        setDoors(arr);
    }

    function updateIdle()
    {
        switch (lastKey)
        {
            case 119: // W
                setPlayerImage(playerUp[0])
                break;
            case 97: // A
                setPlayerImage(playerLeft[0])
                break;
            case 100: // D
                setPlayerImage(playerRight[0])
                break;
            case 115: // S
                setPlayerImage(playerDown[0])
                break;
            default:
                break;
        }
    }

    // Citation start: https://youtu.be/yP5DKzriqXA
    function rectangleCollision({rectangle}){
        // (400, 300) = Player's X and Y position 
        return(
            400 + playerImageWidth >= rectangle.position.x &&
            400 <= rectangle.position.x + rectangle.width &&
            300 <= rectangle.position.y + rectangle.height &&
            300 + playerImageHeight >= rectangle.position.y
        )
    }
    // Citation END
    const handleKeyPress = (event) => {
        setMove(true);

        // Citation start: https://youtu.be/yP5DKzriqXA
        // Check for collision
        for (let i = 0; i < collisionArray.length; i++){
            const boundary = collisionArray[i]

            switch (event.keyCode)
            {
                case 119: // W
                    if (rectangleCollision({
                        rectangle: {
                            ...boundary,
                            position: {
                                x : boundary.position.x,
                                y : boundary.position.y + 10
                            }
                        }
                    }))
                    {
                        setMove(false);
                        break;
                    }
                    break;
                case 97: // A
                    if (rectangleCollision({
                        rectangle: {
                            ...boundary,
                            position: {
                                x : boundary.position.x + 10,
                                y : boundary.position.y
                            }
                        }
                    }))
                    {
                        setMove(false)
                        break;
                    }
                    break;
                case 115: // S
                    if (rectangleCollision({
                        rectangle: {
                            ...boundary,
                            position: {
                                x : boundary.position.x,
                                y : boundary.position.y - 10
                            }
                        }
                    }))
                    {
                        setMove(false)
                        break;
                    }
                    break;
                case 100: // D
                    if (rectangleCollision({
                        rectangle: {
                            ...boundary,
                            position: {
                                x : boundary.position.x - 10,
                                y : boundary.position.y
                            }
                        }
                    }))
                    {
                        setMove(false)
                        break;
                    }
                    break;
                default:
                    break;
            }
        }

        if (battleChance > 30)
        {
            // Check for battlezone
            for (let i = 0; i < battleZoneArray.length; i++)
            {
                const battleZone = battleZoneArray[i]

                // Calculate whether the player is in the battlezone area
                const overlappingLength = Math.min(400 + playerImageWidth, battleZone.position.x + battleZone.width) - 
                Math.max(400, battleZone.position.x)
                const overlappingWidth = Math.min(300 + playerImageHeight, 
                battleZone.position.y + battleZone.height) - Math.max(300, battleZone.position.y)
                const overlappingArea = overlappingLength * overlappingWidth 
                
                if (rectangleCollision({
                    rectangle: battleZone
                }) && overlappingArea > (playerImageWidth * playerImageHeight) / 2 && Math.random() < 0.02)
                {
                    // Battle activation
                    setBattleStart(true);
                    setBattle(true);
                    setPlayerHP(60);
                    if (currAudio !== null) {
                        currAudio.pause();
                    }
                    
                    
                    let rand = Math.floor(Math.random() * 100) + 1;
                    if (rand >= 75)
                    {
                        // console.log('Dave');
                        setEnemyImage(daveImage);
                        setBattleText(<>You encounter W.D.R.! <br/> </>)
                        setEnemyHP(30);
                        setCurrAudio(battle_theme_1);
                    }
                    else if (rand >= 50)
                    {
                        // console.log('Jeremy');
                        setEnemyImage(jeremyImage);
                        setBattleText(<>You encounter the Jeremy himself! <br/> </>)
                        setEnemyHP(30);
                        setCurrAudio(battle_theme_2);
                    }
                    else if (rand >= 25)
                    {
                        // console.log('Jon');
                        setEnemyImage(jonImage);
                        setBattleText(<>You encounter Jonathan! <br/> </>)
                        setEnemyHP(30);
                        setCurrAudio(battle_theme_3);
                    }
                    else
                    {
                        // console.log('Todd');
                        setEnemyImage(toddImage);
                        setBattleText(<>You encounter the almighty Todd! <br/> </>)
                        setEnemyHP(30);
                        setCurrAudio(battle_theme_4);
                    }
                    
                    break;
                }
            }
        }
        else
        {
            setBattleChance(0);
        }

        setBattleChance(battleChance + 1);

        // Check for door collision
        for (let i = 0; i < doorsArray.length; i++)
        {
            const doorZone = doorsArray[i]
            const doorSym = doorsType[i]

            const overlappingLength = Math.min(400 + playerImageWidth, doorZone.position.x + doorZone.width) - 
            Math.max(400, doorZone.position.x)
            const overlappingWidth = Math.min(300 + playerImageHeight, doorZone.position.y + doorZone.height) - 
            Math.max(300, doorZone.position.y)
            const overlappingArea = overlappingLength * overlappingWidth 
             
            if (rectangleCollision({
                rectangle: doorZone
            }) && (overlappingArea > (playerImageWidth * playerImageHeight) * 0.85) && (user))
            {
                if (currAudio !== null){
                    currAudio.pause();
                }
                setChatStatus(true);
                setCurrAudio(chat_theme);
                // symbol === 881 || symbol === 882 || symbol === 900 || symbol === 901 || symbol === 938
                if (doorSym === 881){
                    handleDoorEntrance("emerald");
                }else if (doorSym === 882){
                    handleDoorEntrance("ruby");
                } else if (doorSym === 900){
                    handleDoorEntrance("sapphire");
                } else if (doorSym === 901){
                    handleDoorEntrance("diamond");
                } else if (doorSym === 938){
                    handleDoorEntrance("black");
                }
                console.log(doorSym)
                break
            }
        }

        // Citation END

        if (canMove)
        {
            if (event.keyCode === 100 || event.keyCode === 115 || event.keyCode === 119 || event.keyCode === 97)
            {
                setGameFrame(gameFrame + 1);
                if (gameFrame % 2 === 0)
                {
                    if (moveFrame < 5)
                    {
                        setFrame(moveFrame + 1);
                    }
                    else
                    {
                        setFrame(0);
                    }
                }
            }

            switch (event.keyCode)
            {
                case 119: // W (Go up)
                    if (lastKey !== 119)
                    {
                        setGameFrame(0);
                        setFrame(0);
                        updateIdle();
                    }
                    setLastKey(119);
                    setPlayerImage(playerUp[moveFrame]);
                    setLocY(imageY + 10);
                    updateCollisions("Up");
                    updateBattleZones("Up");
                    updateDoors("Up");
                    break;
                case 97: // A (Go left)
                    if (lastKey !== 97)
                    {
                        setGameFrame(0);
                        setFrame(0);
                        updateIdle();
                    }
                    setLastKey(97);
                    setPlayerImage(playerLeft[moveFrame]);
                    setLocX(imageX + 10);
                    updateCollisions("Left");
                    updateBattleZones("Left");
                    updateDoors("Left");
                    break;
                case 115: // S (Go down)
                    if (lastKey !== 115)
                    {
                        setGameFrame(0);
                        setFrame(0);
                        updateIdle();
                    }
                    setLastKey(115);
                    setPlayerImage(playerDown[moveFrame]);
                    setLocY(imageY - 10);
                    updateCollisions("Down");
                    updateBattleZones("Down");
                    updateDoors("Down");
                    break;
                case 100: // D (Go right)
                    if (lastKey !== 100)
                    {
                        setGameFrame(0);
                        setFrame(0);
                        updateIdle();
                    }
                    setLastKey(100);
                    setPlayerImage(playerRight[moveFrame]);
                    setLocX(imageX - 10);
                    updateCollisions("Right");
                    updateBattleZones("Right");
                    updateDoors("Right");
                    break;
                default:
                    break;
            }
        }
    };
    
    const handleKeyUp = () => {
        setGameFrame(0);
        setFrame(0);
        updateIdle();
    }

    // Citation Start: https://www.pluralsight.com/guides/event-listeners-in-react-components
    useEffect(() => {
        if (!battleActive)
        {
            window.addEventListener('keypress', handleKeyPress);
            window.addEventListener('keyup', handleKeyUp);
        }

        // Cleanup this component
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            window.removeEventListener('keyup', handleKeyUp)
        };
    });
    // Citation END: 

    function Attack()
    {
        // Function only does something if you are in battle
        if (menuOpacity >= 0.99 && battleActive && enemyHP > 0)
        {
            let playerDamage = Math.floor(Math.random() * 10 + 10);
            let enemyDamage = Math.floor(Math.random() * 10 + 10);

            if (speakerState)
            {
                attackSfx.play();
            }

            // You will attack, followed by Todd attacking you
            if (enemyHP - playerDamage <= 0)
            {
                setEnemyHP(0);
                setBattleText(<>{battleText} You deal {playerDamage} damage! <br/> Enemy defeated! <br/> </>)
            }
            else
            {
                setEnemyHP(enemyHP - playerDamage);
                setPlayerHP(playerHP - enemyDamage);
                setBattleText(<>{battleText} You deal {playerDamage} damage! <br/> Enemy hits you for {enemyDamage} damage! <br/> </>)
            }

            if (enemyHP - playerDamage <= 0)
            {
                // Enemy has been defeated so end battle
                setTimeout(() => {  
                    currAudio.stop();
                    setBattleEnd(true);
                    setGameFrame(0);
                    setFrame(0);
                    updateIdle();
                    setBattleChance(0);
                    setCurrAudio(overworld_theme);
                }, 1500);
            }
        }
    }

    function Run()
    {
        // Function only does something if you are in battle
        if (menuOpacity >= 0.99 && enemyHP > 0)
        {
            currAudio.stop();
            if (speakerState)
            {
                RunSound.play();
            }

            setBattleText(<>{battleText} You run from battle... </>)
            setTimeout(() => {  
                setBattleEnd(true);
                setGameFrame(0);
                setFrame(0);
                updateIdle();
                setBattleChance(0);
                setCurrAudio(overworld_theme);
            }, 1500);
        }
    }

    function toggleSound()
    {
        if (currAudio != null)
        {
            if (speakerState)
            {
                // Mute
                setSpeakerImage(Muted);
                setSpeakerState(false);
                currAudio.mute(true);
    
            }
            else
            {
                // Unmute or play if first time
                if (!currAudio.playing())
                {
                    currAudio.play();
                }
                else
                {
                    currAudio.mute(false);
                }
                setSpeakerImage(Sound);
                setSpeakerState(true);
            }
        }
    }

    
    return (
            <div>
                <div
                    style={{
                        backgroundColor: 'black',
                        width: '1200px',
                        height: '675px',
                        position: 'absolute',
                        opacity: transOpacity,
                        pointerEvents: 'none'
                    }}
                />
                <canvas
                    ref = {canvasRef}
                    width = {1200}
                    height = {675}
                />  
                <div
                    style={{
                        backgroundColor: 'white',
                        border: '4px solid',
                        width: '1193px',
                        height: '175px',
                        position: 'absolute',
                        opacity: menuOpacity,
                        bottom: 45
                    }}
                />

                {/* Buttons for combat */}
                <div>
                    <button onClick={Attack} style = {{
                        width: '600px',
                        height: '176px',
                        position: 'absolute',
                        left: 4,
                        color: 'black',
                        opacity: menuOpacity,
                        bottom: 48,
                        fontSize: 50,
                        
                    }}>
                        Attack
                    </button>

                    <button onClick={Run} style = {{
                        width: '595px',
                        height: '176px',
                        position: 'absolute',
                        color: 'black',
                        opacity: menuOpacity,
                        left: 603,
                        bottom: 48,
                        fontSize: 50
                    }}>
                        Run
                    </button>
                </div>

                <h1 style ={{
                    // Battle Text
                    position: 'absolute',
                    top: 60,
                    left: 1210,
                    margin: '0px',
                    fontSize: 20,
                    opacity: menuOpacity,
                }}>
                    {battleText}
                </h1>

                <h1 style ={{
                    // Player's HP
                    position: 'absolute',
                    bottom: 240,
                    left: 10,
                    margin: '0px',
                    fontSize: 45,
                    color: 'red',
                    opacity: menuOpacity,
                }}>
                    You: {playerHP}/60
                </h1>
                
                <h1 style ={{
                    // Enemy's HP
                    position: 'absolute',
                    top: 50,
                    left: 450,
                    margin: '0px',
                    fontSize: 45,
                    color: 'red',
                    opacity: menuOpacity,
                }}>
                    Enemy: {enemyHP}/30
                </h1>

                <img onClick={toggleSound} style= {{
                    position: 'absolute',
                    zIndex: 9,
                    top: 60,
                    left: 20 
                }} src={speakerImage}>
                </img>
            </div>
        )
    };
export default DrawCanvas