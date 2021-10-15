const ROW                   = "projectCard-Row";

const CARD                  = "projectCard";
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

    static ToHTML(Card)
    {
        const cardTemplate = `<div class="card text-white projectCard">
        <!-- BACKGROUND IMAGE -->
        <img class="bd-placeholder-img bd-placeholder-img-lg card-img projectCard-Image" src="${Card.image}" alt="bgImage">
  
        <div class="card-img-overlay projectCard-OverlayZone">
          <!-- TITLE AND TECH LOGO -->
          <h4 class="card-title">${Card.title} 
            <img class="img-fluid float-end m-3" style="height: 35px;" src="${Card.logo}" alt="ProjectLogo">
          </h4>

          <!-- SKILL TAGS -->
          <h6 class="card-text projectCard-TagArea"></h6>

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
    console.log("Loaded");

    let testCard = new Card();

    document.getElementsByClassName(ROW)[0].appendChild(Card.ToHTML(testCard));
}
