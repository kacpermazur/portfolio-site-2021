const ROW                   = "row projectCard-Row";

const CARD                  = "projectCard";
const CARD_TITLE            = "card-title";
const CARD_OVERLAY          = "projectCard-OverlayZone";
const CARD_IMAGE            = "projectCard-Image";
const CARD_TAGAREA          = "projectCard-TagArea";
const CARD_TAG              = "projectCard-Tag"
const CARD_PREVIEW_TEXT     = "projectCard-PreviewText";
const CARD_PREVIEW_BUTTON   = "projectCard-PreviewButton";
const CARD_FULL_BODY        = "projectCard-Collapse";

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

    GetState()  {    return this.state;}
    Inspect()   {    this.state = CARD_STATE.HOVER;}
    Open()      {    this.state = CARD_STATE.OPENED;}
    Close()     {    this.state = CARD_STATE.CLOSED;}

    static ToHTML(Card)
    {
        const cardTemplate = `<div class="card text-white projectCard">
        <!-- BACKGROUND IMAGE -->
        <img class="bd-placeholder-img bd-placeholder-img-lg card-img projectCard-Image" src="${Card.image}" alt="bgImage">
  
        <div class="card-img-overlay projectCard-OverlayZone">
            <div class="row justify-content-between">
                <div class="col">
                <h4 class="card-title">${Card.title}</h4>

                <!-- SKILL TAGS -->
                <h6 class="card-text projectCard-TagArea"></h6>
                </div>

                <div class="col">
                <!-- TITLE AND TECH LOGO -->
                <img class="img-fluid float-end m-3" style="height: 40px;" src="${Card.logo}" alt="ProjectLogo">
                </div>
            </div>

          <!-- DESCRIPTION -->
          <p style="margin-top: 2.5%;" class="card-text text-blur-out projectCard-PreviewText">
            ${Card.previewText}
          </p>

          <!-- BUTTON LINKS -->
          <div style="margin-top: 12%;" class="text-center">
            <button class="btn btn-outline-primary fade-out-top projectCard-PreviewButton" type="button">Show More</button>
          </div>
        </div>

        <div class="collapse projectCard-Collapse" id="projectCard-Body">
            ${Card.fullText}
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
        console.log(`Card: ${Card.title} has been added!`);
    }

    static #RegisterEvents(cardHTML)
    {   
        const overLay = cardHTML.getElementsByClassName(CARD_OVERLAY)[0];
        overLay.addEventListener('mouseenter', this.#OnHover);
        overLay.addEventListener('mouseleave', test);
    }

    static #OnHover(e)
    {
        console.log(e.target.getElementsByClassName(CARD_TITLE)[0].innerHTML);
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


function test(e)
{
    console.log(`fwefwsadasdefwe`);
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

