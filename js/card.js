function OnCardMouseEnter(e)  { CardHoverEffect(e, true) }
function OnCardMouseExit(e)   { CardHoverEffect(e, false) }

function CardHoverEffect(e, isHovered)
{
    const imageTar    = e.parentElement.getElementsByClassName("gameCardImage")[0];
    const paraTextTar = e.getElementsByClassName("gameCardText")[0];
    const buttonTar = e.getElementsByClassName("gameCardButton")[0];

    if(isHovered === true)
    {
        paraTextTar.classList.remove("text-b lur-out");
        paraTextTar.classList.add("text-focus-in");

        buttonTar.classList.remove("fade-out-top");
        buttonTar.classList.add("fade-in-bottom");

        imageTar.style.filter = "blur(3px)";
    }
    else
    {
        paraTextTar.classList.remove("text-focus-in");
        paraTextTar.classList.add("text-blur-out");

        buttonTar.classList.remove("fade-in-bottom");
        buttonTar.classList.add("fade-out-top");
        
        imageTar.style.filter = "blur(0px)"; 
    }
}