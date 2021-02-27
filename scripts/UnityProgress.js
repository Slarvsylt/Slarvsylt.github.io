var isGameReady;

function UnityProgress (dom) {
  this.progress = 0.0;
  this.message = "";
  //this.dom = dom;
  //var parent = dom.parentNode;
  
  this.SetProgress = function (progress) { 
    if (this.progress < progress)
      this.progress = progress; 
    if (progress == 1) {
      //this.Clear();
      //return;
      this.SetMessage("Preparing...");
      document.getElementById("bgBar").style.display = "none";
      document.getElementById("progressBar").style.display = "none";

      var adjustRetina = function() {
    if (devicePixelRatio > 1) {
        var canvas = document.querySelector("canvas");
 
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
 
        canvas.style.transformOrigin = canvas.width/devicePixelRatio + " " + canvas.height/devicePixelRatio;
        //canvas.style.transform = "scale("+1.0/devicePixelRatio+")";
    }
}
 
// adjustRetina();
    } 
    this.Update();
  }
  this.SetMessage = function (message) { 
    this.message = message; 
    this.Update();
  }
  this.Clear = function() {
    document.getElementById("loadingBox").style.display = "none";
    document.getElementById("loadingBg").style.display = "none";
  }
  this.Update = function() {
    var length = 200 * Math.min(this.progress, 1);
    bar = document.getElementById("progressBar")
    bar.style.width = length + "px";
    //document.getElementById("loadingInfo").innerHTML = this.message;
  }
  //this.Update ();
}

var unityProgress = new UnityProgress();

function UpdateLoadingBar(gameInstance, progress) {
  unityProgress.SetProgress(progress);  
}

function GameReady() {
  unityProgress.Clear();
  isGameReady = true;
  registerKBListeners();
}