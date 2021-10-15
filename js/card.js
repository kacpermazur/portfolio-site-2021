const ROW                   = "row projectCard-Row";

const CARD                  = "projectCard";
const CARD_TITLE            = "card-title";
const CARD_OVERLAY          = "projectCard-OverlayZone";
const CARD_IMAGE            = "projectCard-Image";
const CARD_TAGAREA          = "projectCard-TagArea";
const CARD_TAG              = "projectCard-Tag"
const CARD_PREVIEW_BODY     = "projectCard-PreviewBody";
const CARD_PREVIEW_TEXT     = "projectCard-PreviewText";
const CARD_PREVIEW_BUTTON   = "projectCard-PreviewButton";
const CARD_FULL_BODY        = "projectCard-FullBody";
const CARD_HIDE_BUTTON      = "projectCard-HideButton";

const Logo = {"Unity":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1280px-Unity_Technologies_logo.svg.png", 
"Unreal":"link", 
"OpenGL":"link", 
"JavaScript":"link"};

const CARD_STATE = {"CLOSED": 0, "OPENED": 1, "HOVER": 2};

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
        this.fullText = "lol it works yay";
        this.linkButtons = ["link", "link"];
        
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
        this.linkButtons = linkButtons // Need
    }

    GetState()  
    {    
        return this.state;
    }

    HoverEnter(cardHTHML)     
    {    
        this.state = CARD_STATE.HOVER;

        const previewText   = cardHTHML.getElementsByClassName(CARD_PREVIEW_TEXT)[0];
        const previewButton = cardHTHML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];
        const previewImage  = cardHTHML.parentElement.getElementsByClassName(CARD_IMAGE)[0];

        previewText.classList.remove("text-blur-out");
        previewText.classList.add("text-focus-in");

        previewButton.classList.remove("fade-out-top");
        previewButton.classList.add("fade-in-bottom");

        previewImage.style.filter = "blur(3px)";
    }

    HoverExit(cardHTHML)     
    {    
        this.state = CARD_STATE.CLOSED;

        const previewText   = cardHTHML.getElementsByClassName(CARD_PREVIEW_TEXT)[0];
        const previewButton = cardHTHML.getElementsByClassName(CARD_PREVIEW_BUTTON)[0];
        const previewImage  = cardHTHML.parentElement.getElementsByClassName(CARD_IMAGE)[0];

        previewText.classList.remove("text-focus-in");
        previewText.classList.add("text-blur-out");

        previewButton.classList.remove("fade-in-bottom");
        previewButton.classList.add("fade-out-top");
        
        previewImage.style.filter = "blur(0px)";
    }

    Open(cardHTHML)      
    {    
        const previewBody = cardHTHML.getElementsByClassName(CARD_PREVIEW_BODY)[0];
        const fullBody    = cardHTHML.getElementsByClassName(CARD_FULL_BODY)[0];

        previewBody.classList.add("d-none");
        fullBody.classList.remove("d-none");

        this.state = CARD_STATE.OPENED;
    }

    Close(cardHTHML)     
    {    
        const previewBody = cardHTHML.getElementsByClassName(CARD_PREVIEW_BODY)[0];
        const fullBody    = cardHTHML.getElementsByClassName(CARD_FULL_BODY)[0];

        fullBody.classList.add("d-none");
        previewBody.classList.remove("d-none");
        
        this.state = CARD_STATE.CLOSED;
    }

    static ToHTML(Card)
    {
        const cardTemplate = `<div class="card text-white projectCard">
        <img class="bd-placeholder-img bd-placeholder-img-lg card-img projectCard-Image" src="${Card.image}" alt="bgImage" style="filter: blur(0);">

        <div class="card-img-overlay projectCard-OverlayZone">
          <div class="row w-100 h-100 g-0 projectCard-PreviewBody">

            <div class="col align-self-start" style="height: 15%; margin-bottom: 2%;">
              <h4 class="card-title">${Card.title}</h4>
                <!-- SKILL TAGS -->
                <h6 class="card-text projectCard-TagArea"></h6>
            </div>

            <div class="col-3 d-none d-sm-block" style="height: 15%;">
              <!-- TITLE AND TECH LOGO -->
              <img class="img-fluid float-end" style="height: 40px;" src="${Card.logo}" alt="ProjectLogo">
            </div>

            <div class="col-12 align-self-start">
              <p class="card-text projectCard-PreviewText lh-1 text-blur-out">
                ${Card.previewText}
              </p>
            </div>

            <div class="col-12 align-self-end text-center">
              <button class="btn btn-outline-primary projectCard-PreviewButton fade-out-top" type="button">Show More</button>
            </div>

          </div>
        </div>

        <div class="row align-items-end w-100 g-0 d-none projectCard-FullBody">
          
            <div class="col-12 align-self-end text-center">
                <button class="btn btn-outline-primary projectCard-HideButton" type="button">Collapse</button>
            </div>

        </div>
     </div>`;

        const tempCardHTML = document.createElement('div');
        tempCardHTML.className = "col-lg-6";
        tempCardHTML.innerHTML = cardTemplate;

        const tagArea = tempCardHTML.getElementsByClassName(CARD_TAGAREA)[0];
        tagArea.innerHTML += `<span class="badge projectCard-Tag bg-dark" style="background-color: ${Card.mainTag.color} !important;">${Card.mainTag.name}</span>`;
        Card.tags.forEach(tag => { tagArea.innerHTML += `<span class="badge projectCard-Tag bg-secondary">${tag}</span>`; });

        if(Card.linkButtons != null)
            console.log(`This ${Card.title} Card Has LinkButtons!`);

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

        overLay.addEventListener('mouseenter', this.#OnHover);
        overLay.addEventListener('mouseleave', this.#OnHover);

        previewButton.addEventListener('click', this.#OnPreview);
        hideButton.addEventListener('click', this.#OnHide);
    }

    static #OnHover(e)
    {
        const titleA = e.target.getElementsByClassName(CARD_TITLE)[0].innerHTML;
        const cardRef = CardFactory.projectCards.get(titleA);

        if(cardRef.GetState() == CARD_STATE.CLOSED)
            cardRef.HoverEnter(e.target);
        else if(cardRef.GetState() == CARD_STATE.HOVER)
            cardRef.HoverExit(e.target);
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

    static GetActiveCard()
    {
        return this.activeProjectCard;
    }

    static LogCards()
    {
        console.log(`Card Count: ${this.projectCardCount} | Row Count: ${this.projectRowCount}`);
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
    let cardA = new Card();

    CardFactory.Add(cardA);
    CardFactory.LogCards();
}
    

