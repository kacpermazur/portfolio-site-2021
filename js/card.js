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
                "OpenGL":"https://upload.wikimedia.org/wikipedia/commons/e/e9/Opengl-logo.svg", 
                "JavaScript":"https://upload.wikimedia.org/wikipedia/commons/b/b6/Badge_js-strict.svg",
                "Csharp":"https://upload.wikimedia.org/wikipedia/commons/0/0d/C_Sharp_wordmark.svg"};

const CARD_STATE = {"CLOSED": 0, "OPENED": 1, "HOVER": 2, "TRANSITION":3};

class Card
{
    constructor()
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

        previewImage.style.filter = "blur(3px)";

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

        previewImage.style.filter = "blur(0px)";

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
        const reSize     = Card.DynmaicResize({ html:fullBody, size:'300px' }, { html:image, size:'100px', blurSize: 'blur(3px)' }, 250);
        
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
        const reSize     = Card.DynmaicResize({ html:fullBody, size:'0px' }, { html:image, size:'300px', blurSize: 'blur(0px)' }, 250);

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

        <img class="card-img projectCard-Image" src="${Card.image}" alt="bgImage" style="filter: blur(0); height: 300px">

        <div class="card-img-overlay projectCard-OverlayZone">
        
            <div class="row w-100 g-0 projectCard-TitleBody">
                <div class="col align-self-start">
                    <h4 class="card-title">${Card.title}</h4>
                    <h6 class="card-text projectCard-TagArea"></h6>
                </div>

                <div class="col-3">
                    <img class="img-fluid float-end" style="height: 55px;" src="${Card.logo}" alt="ProjectLogo">
                </div>
            </div>

            <div class="row w-100 g-0 projectCard-PreviewBody">
                <div class="col-12 align-self-start">
                    <p class="card-text projectCard-PreviewText lh-1" style="opacity: 0;">
                        ${Card.previewText}
                    </p>
                </div>

                <div class="col-12 align-self-end text-center">
                    <button class="btn btn-outline-primary projectCard-PreviewButton" type="button" style="opacity: 0;">Show More</button>
                </div>

            </div>

        </div>

        <div class="row w-100 g-0 projectCard-FullBody d-none" style="height: 0px;"> 
        
            <div class="col-12">
                <p class="card-text projectCard-FullText lh-1 d-none"></p>
            </div>

            <div class="col-12 align-self-end text-center projectCard-ButtonArea">
                <button class="btn btn-outline-primary projectCard-HideButton float-end d-none" type="button">Close</button>
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
            nRow.style.marginTop = '2%';
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

const TEST = {"SINGLE":0, "MULTI":1};
function TestCards(test)
{
    if(test == TEST.SINGLE)
    {
        console.log("===== Card Single Test =====");

        let testCard = new Card();

        CardFactory.Add(testCard);
    }
    else
    {
        console.log("===== Card Array Test =====");

        let arrayCards = [new Card(), new Card(), new Card(), new Card()];
        arrayCards[0].title = "Project A"; arrayCards[1].title = "Project B"; arrayCards[2].title = "Project C"; arrayCards[3].title = "Project D";
    
        CardFactory.AddCollection(arrayCards);
    }
}

