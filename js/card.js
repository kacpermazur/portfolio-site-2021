const ROW                   = "row projectCard-Row";

const CARD                  = "projectCard";
const CARD_TITLE            = "card-title";
const CARD_OVERLAY          = "projectCard-OverlayZone";
const CARD_IMAGE            = "projectCard-Image";
const CARD_TAG_AREA         = "projectCard-TagArea";
const CARD_TAG              = "projectCard-Tag"
const CARD_PREVIEW_BODY     = "projectCard-PreviewBody";
const CARD_PREVIEW_TEXT     = "projectCard-PreviewText";
const CARD_PREVIEW_BUTTON   = "projectCard-PreviewButton";
const CARD_FULL_BODY        = "projectCard-FullBody";
const CARD_FULL_TEXT        = "projectCard-FullText";
const CARD_BUTTON_AREA      = "projectCard-ButtonArea";
const CARD_LINK_BUTTON      = "projectCard-LinkButton";
const CARD_HIDE_BUTTON      = "projectCard-HideButton";

const Logo = {  "Unity":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg", 
                "Unreal":"https://upload.wikimedia.org/wikipedia/commons/d/da/Unreal_Engine_Logo.svg", 
                "OpenGL":"content/openGL.png", 
                "JavaScript":"https://upload.wikimedia.org/wikipedia/commons/b/b6/Badge_js-strict.svg",
                "Csharp":"content/csharp.png"};

const CARD_STATE = {"CLOSED": 0, "OPENED": 1, "HOVER": 2, "TRANSITION":3};

class Card
{
    constructor(obj)
    {
        this.title = "projectTitle";
        this.image = "https://via.placeholder.com/600x270.png";
        this.mainTag = {name: "Main", color: "#c31313"}
        this.tags = ["Tag", "Tag"];
        this.logo = Logo.Unity;
        this.previewText = "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.";
        this.fullText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tristique, nisl quis pellentesque vulputate, 
                        dui ligula mattis nisi, nec ornare leo velit quis magna. Nullam sed pulvinar lectus, vel vulputate ligula. 
                        Phasellus ac convallis lorem, quis efficitur quam. Pellentesque commodo condimentum augue non pulvinar. 
                        Nulla tincidunt tincidunt neque, id gravida orci fringilla non. Vestibulum lorem diam, aliquet molestie 
                        tempor sed, fringilla nec eros. In gravida erat diam, sed tincidunt sapien varius a. Donec sodales risus sed.`;
        this.linkButtons = [{"Name":"GitHub", "Link":"#"},{"Name":"YouTube", "Link":"#"}];
        

        for (var prop in obj) this[prop] = obj[prop];
        this.state = CARD_STATE.CLOSED;
    }

    SetData(title, image, mainTag, tags, logo, previewText, fullText, linkButtons)
    {
        this.title = title;
        this.image = image;
        this.mainTag = mainTag;
        this.tags = tags;
        this.logo = logo;
        this.previewText = previewText;
        this.fullText = fullText;
        this.linkButtons = linkButtons
    }

    GetState()  
    {    
        return this.state;
    }

    async HoverEnter(CardHTML)     
    {    
        this.state = CARD_STATE.HOVER;

        const previewText   = CardHTML.getElementsByClassName(CARD_PREVIEW_TEXT)[0];
        const previewButton = CardHTML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];
        const previewImage  = CardHTML.parentElement.getElementsByClassName(CARD_IMAGE)[0];

        previewImage.style.filter = "blur(3px) brightness(25%)";
        //previewImage.style.filter = "";

        await Promise.all([
            (async() => await Card.Transition(previewText, 'text-focus-in', 415, '1')) (),
            (async() => await Card.Transition(previewButton, 'fade-in-bottom', 415, '1')) ()
        ]);
    }

    async HoverExit(CardHTML)     
    {    
        this.state = CARD_STATE.CLOSED;

        const previewText   = CardHTML.getElementsByClassName(CARD_PREVIEW_TEXT)[0];
        const previewButton = CardHTML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];
        const previewImage  = CardHTML.parentElement.getElementsByClassName(CARD_IMAGE)[0];

        previewImage.style.filter = "blur(0px) brightness(60%)";

        await Promise.all([
            (async() => await Card.Transition(previewText, 'text-blur-out', 415, '0')) (),
            (async() => await Card.Transition(previewButton, 'fade-out-top', 415, '0')) ()
        ]);
    }

    async Open(CardHTML)      
    {   
        this.state = CARD_STATE.OPENED;

        const image       = CardHTML.getElementsByClassName(CARD_IMAGE)[0];
        const previewBody = CardHTML.getElementsByClassName(CARD_PREVIEW_BODY)[0];

        const fullBody    = CardHTML.getElementsByClassName(CARD_FULL_BODY)[0];
        const fullText    = CardHTML.getElementsByClassName(CARD_FULL_TEXT)[0];
        const hideButton  = CardHTML.getElementsByClassName(CARD_HIDE_BUTTON)[0];

        const hideText   = Card.HideShowSingle(fullText, true, 400);
        const hideBtn    = Card.HideShowSingle(hideButton, true, 400);
        const hideLinks  = Card.HideShowCollection(CardHTML.getElementsByClassName(CARD_LINK_BUTTON), true, 400);
        const reSize     = Card.DynmaicResize({ html:fullBody, size:'300px' }, { html:image, size:'100px', blurSize: 'blur(3px) brightness(50%)' }, 250);
        
        await Card.HideAndShow(previewBody, fullBody, 0);
        await Promise.all([
            (async() => await hideText)(),
            (async() => await hideBtn)(),
            (async() => await hideLinks)(),
            (async() => await reSize)()
        ]);
    }

    async Close(CardHTML)     
    {    
        this.state = CARD_STATE.TRANSITION;

        const image         = CardHTML.getElementsByClassName(CARD_IMAGE)[0];
        const previewBody   = CardHTML.getElementsByClassName(CARD_PREVIEW_BODY)[0];
        const previewText   = CardHTML.getElementsByClassName(CARD_PREVIEW_TEXT)[0];
        const previewButton = CardHTML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];

        const fullBody    = CardHTML.getElementsByClassName(CARD_FULL_BODY)[0];
        const fullText    = CardHTML.getElementsByClassName(CARD_FULL_TEXT)[0];
        const hideButton  = CardHTML.getElementsByClassName(CARD_HIDE_BUTTON)[0];
        
        const hideText   = Card.HideShowSingle(fullText, false, 200);
        const hideBtn    = Card.HideShowSingle(hideButton, false, 200);
        const hideLinks  = Card.HideShowCollection(CardHTML.getElementsByClassName(CARD_LINK_BUTTON), false, 200);
        const reSize     = Card.DynmaicResize({ html:fullBody, size:'0px' }, { html:image, size:'300px', blurSize: 'blur(0px) brightness(60%)' }, 250);

        previewText.style.opacity = 0;
        previewButton.style.opacity = 0;

        await Promise.all([
            (async() => await hideText)(),
            (async() => await hideBtn)(),
            (async() => await hideLinks)(),
            (async() => await reSize)()
        ]);
        await Card.HideAndShow(fullBody, previewBody, 525);
        
        this.state = CARD_STATE.CLOSED;
    }

    static DynmaicResize(body, image, time)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
                body.html.style.height = body.size;

                image.html.style.height = image.size;
                image.html.style.filter = image.blurSize;
            }, time);
        }); 
    }

    static HideShowCollection(elements, toShow, time)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
                if(toShow == true)
                    [].forEach.call(elements, elemenet => elemenet.classList.remove("d-none"));
                    //elementArray.forEach(elemenet => elemenet.classList.remove("d-none"));
                else
                    [].forEach.call(elements, elemenet => elemenet.classList.add("d-none"));
                    //elementArray.forEach(elemenet => elemenet.classList.add("d-none"));
            }, time);
        });
    }

    static HideShowSingle(elemenet, toShow, time)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
                if(toShow == true)
                    elemenet.classList.remove("d-none");
                else
                    elemenet.classList.add("d-none");
            }, time);
        });
    }

    static HideAndShow(toHideHTML, toShowHTML, time)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
                toHideHTML.classList.add("d-none");
                toShowHTML.classList.remove("d-none");
            }, time);
        });
    }

    static Transition(targetDiv, toClass, time, opacity)
    {
        targetDiv.classList.add(toClass);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
                targetDiv.classList.remove(toClass);
                targetDiv.style.opacity = opacity;
            }, time);
        });
    }

    static ToHTML(Card)
    {
        const cardTemplate = `
    <div class="card text-white projectCard">

        <img class="card-img projectCard-Image" src="${Card.image}" alt="bgImage" style="filter: blur(0px) brightness(60%); height: 300px;">

        <div class="card-img-overlay projectCard-OverlayZone">
        
            <div class="row w-100 g-0 projectCard-TitleBody">
                <div class="col align-self-start">
                    <h4 class="card-title pojectCard-Title" style="font-weight: 600">${Card.title}</h4>
                    <h6 class="card-text projectCard-TagArea"></h6>
                </div>

                <div class="col-3">
                    <img class="img-fluid projectCard-techLogo float-end" style="filter: brightness(0) invert(1);" src="${Card.logo}" alt="ProjectLogo">
                </div>
            </div>

            <div class="row w-100 g-0 projectCard-PreviewBody">
                <div class="col-12 align-self-start">
                    <p class="card-text projectCard-PreviewText lh-1" style="opacity: 0;">
                        ${Card.previewText}
                    </p>
                </div>

                <div class="col-12 align-self-end text-center">
                    <button class="btn btn-outline-light projectCard-PreviewButton" type="button" style="opacity: 0;">Show More</button>
                </div>

            </div>

        </div>

        <div class="row w-100 g-0 projectCard-FullBody d-none" style="height: 0px;"> 
        
            <div class="col-12">
                <p class="card-text projectCard-FullText lh-1 d-none"></p>
            </div>

            <div class="col-12 align-self-end text-center projectCard-ButtonArea">
                <button class="btn btn-outline-dark projectCard-HideButton float-end d-none" type="button">Close</button>
            </div>

        </div>
    </div>`;

        const tempCardHTML = document.createElement('div');
        tempCardHTML.className = "col-lg-6";
        tempCardHTML.innerHTML = cardTemplate;

        const tagArea = tempCardHTML.getElementsByClassName(CARD_TAG_AREA)[0];
        tagArea.innerHTML += `<span class="badge projectCard-Tag bg-dark" style="background-color: ${Card.mainTag.color} !important;">${Card.mainTag.name}</span>`;
        Card.tags.forEach(tag => { tagArea.innerHTML += `<span class="badge projectCard-Tag bg-secondary">${tag}</span>`; });

        const fullText = tempCardHTML.getElementsByClassName(CARD_FULL_TEXT)[0];
        fullText.innerHTML = Card.fullText;

        const buttonArea = tempCardHTML.getElementsByClassName(CARD_BUTTON_AREA)[0];
        if(Card.linkButtons != null)
            Card.linkButtons.forEach(site => { buttonArea.innerHTML += `<a class="btn btn-outline-info projectCard-LinkButton float-start d-none" href="${site.Link}" role="button">${site.Name}</a>`; });

        return tempCardHTML;
    }
}

class CardFactory
{
    static projectCards = new Map();
    static activeProjectCard = null
    static projectCardCount  = 0;
    static projectRowCount   = -1;

    static Add(card)
    {
        if(this.projectCards.has(card.title))
        {
            console.log(`Unable to add card with same project title! --> ${card.title}`);
            return;
        }

        const projectCardArea = document.getElementsByClassName("projectCard-Container")[0];

        if(this.projectCardCount % 2 == 0)
        {
            const nRow = document.createElement('div');
            nRow.className = ROW;
            projectCardArea.appendChild(nRow);
            this.projectRowCount++;
        }
        
        const currentRow = document.getElementsByClassName(ROW)[this.projectRowCount];
        const tempCard = Card.ToHTML(card);

        currentRow.appendChild(tempCard);
        this.#RegisterEvents(tempCard);

        this.projectCards.set(card.title, card);
        this.projectCardCount++;

        console.log(`Card: ${card.title} has been added!`);
    }

    static #RegisterEvents(cardHTML)
    {   
        const overLay       = cardHTML.getElementsByClassName(CARD_OVERLAY)[0];
        const previewButton = cardHTML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];
        const hideButton    = cardHTML.getElementsByClassName(CARD_HIDE_BUTTON)[0];

        overLay.addEventListener('mouseenter', this.#OnHoverEnter);
        overLay.addEventListener('mouseleave', this.#OnHoverExit);

        previewButton.addEventListener('click', this.#OnPreview);
        hideButton.addEventListener('click', this.#OnHide);
    }

    static AddCollection(cards)
    {
        if(cards.length < 1)
        {
            console.log(`Collections of cards is empty unable to add!`);
            return;
        }

        cards.forEach(card => this.Add(card));
    }

    static GetActiveCard()
    {
        return this.activeProjectCard;
    }

    static LogCards()
    {
        console.log(`Card Count: ${this.projectCardCount} | Row Count: ${this.projectRowCount}`);
    }

    static #OnHoverEnter(e)
    {
        const titleA = e.target.getElementsByClassName(CARD_TITLE)[0].innerHTML;
        const cardRef = CardFactory.projectCards.get(titleA);

        if(cardRef.GetState() == CARD_STATE.CLOSED)
            cardRef.HoverEnter(e.target);
    }

    static #OnHoverExit(e)
    {
        const titleA = e.target.getElementsByClassName(CARD_TITLE)[0].innerHTML;
        const cardRef = CardFactory.projectCards.get(titleA);

        if(cardRef.GetState() == CARD_STATE.HOVER)
            cardRef.HoverExit(e.target);
        else if (cardRef.GetState() == CARD_STATE.TRANSITION)
            cardRef.state = CARD_STATE.CLOSED;
    }

    static #OnPreview(e)
    {
        const cardHTML = e.target.parentElement.parentElement.parentElement.parentElement;
        const titleA = cardHTML.getElementsByClassName(CARD_TITLE)[0].innerHTML;
        const cardRef = CardFactory.projectCards.get(titleA);

        cardRef.Open(cardHTML);
    }

    static #OnHide(e)
    {
        const cardHTML = e.target.parentElement.parentElement.parentElement.parentElement;
        const titleA = cardHTML.getElementsByClassName(CARD_TITLE)[0].innerHTML;
        const cardRef = CardFactory.projectCards.get(titleA);

        cardRef.Close(cardHTML);
    }

    static ConvertObjectArrayToType(textJSON)
    {
        const jsonData = JSON.parse(textJSON);

        if(jsonData.length < 1)
        {
            console.log(`JSON Data empty unable to convert!`);
            return;
        }

        let newArr = [];
        jsonData.forEach(obj => newArr.push(new Card(obj)));
        return newArr;
    }
}

if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', Start)
}
else
{
    Start();
}

function Start()
{
    TestCards(TEST.MULTI);
    CardFactory.LogCards();
}

const TEST = {"NONE":-1, "SINGLE":0, "MULTI":1};
function TestCards(test)
{
    if(test == TEST.NONE) return;

    if(test == TEST.SINGLE)
    {
        console.log("===== Card Single Test =====");

        let testCard = new Card();

        
        CardFactory.Add(testCard);
    }
    else
    {
        console.log("===== Card Array Test =====");
    
        const arrayCards = CardFactory.ConvertObjectArrayToType(StaticTextJSON);
        CardFactory.AddCollection(arrayCards);
    }
}

const StaticTextJSON  = `[
        {
           "title":"Comsic Frontline AR",
           "image":"content/projects/unityHofliCosmic.gif",
           "mainTag":{
              "name":"Hofli",
              "color":"#fa2742"
           },
           "tags":[
              "Tools",
              "Game Systems",
              "Android, iOS",
              "AR"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"Developed for Andrioid & iOS, Cosmic Frontline is visually stunning AR strategy game with responsive AI and selections of challenges.",
           "fullText":"During this project I have maintained existing tools to work with updated AR foundation SDK to function in the existing development pipeline. Integrated designer friendly internal editor tools based on proposed design specs. Added platform specific improvements to existing and new tool chains to improve better performance on specific platforms.",
           "linkButtons":[
              {
                 "Name":"Site",
                 "Link":"https://hofli.com/cosmic-frontline/"
              },
              {
                 "Name":"YouTube",
                 "Link":"https://www.youtube.com/watch?v=21z3zoPaShs"
              },
              {
                 "Name":"AppStore",
                 "Link":"https://apps.apple.com/app/cosmic-frontline-ar/id1441521950"
              },
              {
                 "Name":"PlayStore",
                 "Link":"https://play.google.com/store/apps/details?id=com.hofli.cosmicfrontline"
              }
           ],
           "state":0
        },
        {
           "title":"Guild Builder",
           "image":"content/projects/unityQQGuildBuilder.png",
           "mainTag":{
              "name":"QQ",
              "color":"#e61d33"
           },
           "tags":[
              "Tools",
              "Game Systems",
              "Windows",
              "Multithreading",
              "Optimization"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"A 2D slice-of-life RPG set in an endearing fantasy world...",
           "fullText":"Implemented a new missing system in an existing large code base. Developed visual based node editor tool that integrates existing game systems into one place while focusing on game designers' usability to reduce complexity when creating new game logic such as npc’s behaviours, game events and interactions. Utilized node editor to work alongside internal job systems to optimize complex game systems for other platforms such as mobile.",
           "linkButtons":[
              {
                 "Name":"Site",
                 "Link":"https://ukgamesfund.com/funded-project/project-guild-builder/"
              }
           ],
           "state":0
        },
        {
           "title":"House Of Mistwalker",
           "image":"content/projects/unrealMist.png",
           "mainTag":{
              "name":"NDA",
              "color":"#7f0ea1"
           },
           "tags":[
              "Raytracing",
              "Game Systems",
              "Advance Locomotion",
              "User Interaction"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/d/da/Unreal_Engine_Logo.svg",
           "previewText":"Upcoming NDA project that utilizes newest technology such as ray-tracing to push visual fidelity and immerse players in a story driven narrative.",
           "fullText":"Implemented complex locomotion controller that physically interacts with the world through root motion and advanced run-time IK limb adjustments. Implemented new game systems alongside bespoke client-facing tooling such as object interaction where game designers can easily create new items into the world with complete interactions and UI for the player’s character to physically interact with and manipulate.",
           "linkButtons":null,
           "state":0
        },
        {
           "title":"Synthetic Dungeon",
           "image":"content/projects/unitySynthDungeon.gif",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "Tools",
              "Game Systems",
              "AI"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"Top-down action RPG dungeon crawler (prototype), where you play as a knight progressing through endless hordes of monsters as you craft more powerful spells and venture through depths of the dark dungeons.",
           "fullText":"One of the most notable skills I have taken away from this project is creating an exponentially scalable spell system that uses Unity’s scriptable objects as composite components that come together to create complex logic and form a spell. These components are designed to be simple and abstract most of the boiler code where the developer can focus on the implementation of behaviour rather than its interactions. Another take back from this project was the AI system, going with the same inspiration from spell system, its a mixture of simple reusable composite actions and conditions that come together like lego pieces to create complex behaviours while maintaining readability and reducing complexity.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/Synthetic-Dungeon"
              }
           ],
           "state":0
        },
        {
           "title":"G-Well",
           "image":"content/projects/unityGravity.gif",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C#",
              "Game Systems",
              "Game Desgin"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"First-person jumping puzzle game. A world filled with floating islands surrounds you and your only means of traversing this strange landscape is your ability to create orbs that manipulate gravity. Use them to bend your trajectory and progress through each island. Explore this seemingly endless world of floating islands and find your way home.",
           "fullText":"New skills that I have learned while working on this project are working with unity physics. Creating gravity projectiles that correctly affects players based on their speed, mass and direction. Another notable skill taken from this project was from the design side where it involved creating a new unique mechanic from scratch and further iterating through it by using different methods such as setting up tests and getting user feedback and using that information to further improve the core mechanic.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/AINT254-Interactive-Systems"
              }
           ],
           "state":0
        },
        {
           "title":"Push n Bash",
           "image":"content/projects/unityParty.png",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C#",
              "Game Systems",
              "Game Desgin",
              "Cross-platform Input"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"Local co-op party game where the goal of the game is to play against your friends and beat them in an array of rounds. The game consists of 4 individual players fighting it out for a top spot.",
           "fullText":"When working on this prototype project I have gained a number of new skills one of the most notable ones is using Unity’s new input system and working with multiple user inputs at the same time. Another skill taken from this project was designing systems ahead for the future such as making a robust system in custom rules to create new mini-games so further implementation of new content is easier without the developer worrying about trivial logic such as checking if a certain player is out. From a design point of view, I have learned how to create a game aimed at everyone, no matter what their skill level where the approach was “less is more” such as only having 2 basic skills for the player to use but also versatile enough for them to be more useful when a player knows how to use them correctly they get rewards so it still keeps the players that have game experience interested in playing the game.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/PartyGame"
              }
           ],
           "state":0
        },
        {
           "title":"Mini Dungeon Slayer",
           "image":"content/projects/unityTDShooter.gif",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C#",
              "Game Systems",
              "Game Desgin"
           ],
           "logo":"https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
           "previewText":"top-down survival game, each round gets progressively harder as the vast number of aliens increase each round and try to hunt you down. As the only survivor left stranged in strangely unstable dimension only armed with a pistol, it’s your goal to fight the endless hordes of aliens.",
           "fullText":"This was one the first game I made using unity and I have learned many technical and design skills about game design and Unity. One of the most notable was designing separate systems such as creating the infinite scaling wave system while using the Unity API for the first time. This was also the first time exploring programming design patterns and game system such using singleton pattern for the game manager and passing references through that. From the game design point of view, I’ve learned the importance of user testing and how to use that data to further improve gameplay.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/AINT152-GAMES-WORKSHOP"
              }
           ],
           "state":0
        },
        {
           "title":"OpenGL Model Loader",
           "image":"content/projects/cppModelLoader.png",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C++",
              "Memory Managment",
              "Redering",
              "Optimization"
           ],
           "logo":"content/openGL.png",
           "previewText":"Header-only obj loader that is able to load files and uncompress files into a mesh format that later is passed into the renderer. The project also has an example code with the loader in action. Able to compress vertices up to 82% e.g. model with 120k vertices down to 21k after removing duplicates.",
           "fullText":"During this project, I have learned a great deal about C++ and memory management and OpenGL and how to efficiently render objects from files. From the C++ side, the most notable skills learned was the use of L and R values to pass data appropriately onto a stack or heap. As for the OpenGL side, I have learned how the API works in terms of how data is handled before the GPU renders it and how to abstract the C API library into a more user-friendly and automated way to reduce redundant code and improve readability. As for the model loading part, creating a suitable data structure to store the data that is being loaded and creating an efficient face parsing algorithm.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/OpenGL-Model-Loader"
              }
           ],
           "state":0
        },
        {
           "title":"OpenGL Physics",
           "image":"content/projects/cppPhysics.gif",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C++",
              "Memory Managment",
              "Engines",
              "Optimization"
           ],
           "logo":"content/openGL.png",
           "previewText":"Project integrates multiple essential libraries such as GLEW, GLFW and STB image for more versatility and end-user experience as these libraries are abstracted out into more game engine inspired layout with game objects, user input and application layers where the end-user doesn’t have to interact with any of the OpenGL functions.",
           "fullText":"This project was developed after the model loader with that many things have been improved and existing skills mentioned before further improved and new ones gained. One of the most notable skills that I acquired during this project was the integration of existing codebases and using them to create a more user-friendly experience, first by studying existing game engines such as Unity and creating a new library that abstract redundant functions and automate some processes.",
           "linkButtons":[
              {
                 "Name":"GitHub",
                 "Link":"https://github.com/kacpermazur/OpenGL-Phyics-"
              }
           ],
           "state":0
        },
        {
           "title":"Ants",
           "image":"content/projects/csharpAnts.gif",
           "mainTag":{
              "name":"University",
              "color":"#d9a41c"
           },
           "tags":[
              "C#",
              "Software",
              "AI"
           ],
           "logo":"content/csharp.png",
           "previewText":"This project was one of my first projects when exploring C#, the program simulates ants behaviour where ants have their own nests and they are able to explore and find food and share that information with other ants. They are able to get the food and bring it back to their nest until the food source is depleted.",
           "fullText":"As this was one of my first projects when exploring C# I have learned many fundamental skills but the most notable one was developing new logic such as ants objects and their behaviours and integrating them into the existing codebase. Another notable skill learned was the use of states such as Agents knowing they if have food location or not and changing their behaviour accordingly.",
           "linkButtons":null,
           "state":0
        }
     ]`;