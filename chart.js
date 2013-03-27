window.chart = (function () {
	//Constructor for the chart object
	//use it to set the default values
   function Chart (details) {
	   this.details=Array();
	   this.events=Array();
	   //scale for the x-axis 1unit=xscale px
	   this.details["xscale"]=(details.xscale==undefined)?100:details.xscale;
	   //scale for the y-axis 1unit=yscale px
	   this.details["yscale"]=(details.yscale==undefined)?100:details.yscale;
	   //title for x-axis
	   this.details["xtitle"]=(details.xtitle==undefined)?100:details.xtitle;
	   //title for y-axis
	   this.details["ytitle"]=(details.ytitle==undefined)?100:details.ytitle;
	   this.details["chartcolor"]=(details.chartcolor==undefined)?100:details.chartcolor;
	   this.details["parentdiv"]=(details.parentdiv==undefined)?"body":details.parentdiv;
	   this.details["showxtitle"]=(details.showxtitle==undefined)?false:details.showxtitle;
	   this.details["showytitle"]=(details.showytitle==undefined)?false:details.showytitle;
	   this.details["showaxis"]=(details.showaxis==undefined)?false:details.showaxis;
	   this.eventslength=0;
   }
   Chart.prototype.addEvent=function(details){
	   this.events.push(details);
   }
   Chart.prototype.getExtremes=function(){	
	   var xmin=this.events[0].xpos;
	   var ymin=this.events[0].ypos;
	   var xmax=0;
	   var ymax=0;
	   for(var i=0;i<this.events.length;i++)
	   {
			if(xmin>this.events[i].xpos){xmin=this.events[i].xpos};
			if(ymin>this.events[i].ypos){ymin=this.events[i].ypos};
			if(this.events[i].xpos>xmax){xmax=this.events[i].xpos};
			if(this.events[i].ypos>ymax){ymax=this.events[i].ypos};
	   }
	   return {xmin:xmin,ymin:ymin,xmax:xmax,ymax:ymax};
   }

   function showtooltip(e,div,description){
    var x = e.pageX - $(div).offset().left;
	var y = e.pageY - $(div).offset().top;
	$("#charttip").html(description).css({"position":"absolute","left":"70px","top":"0px"}).show();
   }
   function pulsate(circle){
        setInterval(function(){
		jump(circle);
		},2000);
   }
   function jump(circle){
	   circle.animate({
				r:20
			}, 1000,function(){
				circle.animate({
				r:25
			}, 1000);
				});
		
   }
   Chart.prototype.chartIt=function(){
	   var parentdiv=document.getElementById(this.details["parentdiv"]);
	   var extremes=this.getExtremes();
	   var width=(extremes.xmax-extremes.xmin)*this.details.xscale+130;
	   var height=(extremes.ymax-extremes.ymin)*this.details.yscale+130;
	  // console.log(width + " "+ height); 
	   $(parentdiv).append($("<p></p>").attr("id","charttip"));
	   var paper= Raphael(parentdiv,width, height);
	   for(var i=0;i<this.events.length;i++)
	   {
		    //console.log((((this.events[i].xpos-extremes.xmin)*this.details.xscale)) + " " +  (height-((this.events[i].ypos-extremes.ymin)*this.details.yscale)));
			var event=this.events[i];
			var color='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
			var circle=paper.circle(((this.events[i].xpos-extremes.xmin)*this.details.xscale+100), height-((this.events[i].ypos-extremes.ymin)*this.details.yscale)-100, 20, 0).attr("fill",color).attr("stroke-width","0px").data("description",event.description).data("color",color);
			circle.hover(function (e) {
				showtooltip(e,parentdiv,this.data("description"));
				jump(this);
				this.attr({"fill": "red"});
			  },
			  function () {
				$("#charttip").empty().hide();
				this.attr({"fill": this.data("color")});
			  }
			);
			if(this.getDetail("showxtitle"))			
				paper.text(((this.events[i].xpos-extremes.xmin)*this.details.xscale+100),(height-60),this.events[i].xtitle);
			if(this.getDetail("showytitle"))
			{
				paper.text(30,height-((this.events[i].ypos-extremes.ymin)*this.details.yscale)-100,this.events[i].ytitle).attr({"text-anchor":"start"});
			}
			this.events[i].circle=circle;
			pulsate(circle);
	   }
	   if(this.getDetail("showaxis"))
	   {
		   paper.path("M70 0L70 "+(height-30));
		   paper.path("M30 "+(height-70)+"L"+(width+100)+" "+(height-70));
	   }
   }
   Chart.prototype.getDetail=function(property){
	   if(this.details[property]==undefined)
	   {
		   return null;
	   }
	   else
	   {
		   return this.details[property];
	   }
   }
   Chart.prototype.getAllDetails=function(){
		return this.details;
   }
   Chart.prototype.getAllEvents=function(){
		return this.events;
   }
   var chart = {
      createChart: function (details) {
		  return new Chart(details);
      }
   };
    
   return chart;
}());