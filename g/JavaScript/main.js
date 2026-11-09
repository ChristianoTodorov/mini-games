let r = 0;
let g = 0;
let b = 0;
let isDark = true;
let running = false;
/** Function using an animation to slowly change the background color
 *  to white or black
 * @param i is the interval used for the animation of the color change 
 */
function changeLightMode(i){
    const container = document.body;
    const text = document.getElementsByTagName('span');
    if(!isDark){
        r--;
        g--;
        b--;
        if(r==0){
            isDark = true;
            clearInterval(i);
        }
    }else{
        r++;
        g++;
        b++;
        if(r+g==510){
            isDark = false;
            clearInterval(i);
        }
    }
    container.style.background = 'rgb('+r+', '+g+', '+b+')';
    text[0].style.color = 'rgb('+(255-r)+', '+(255-g)+', '+(255-b)+')';
}
