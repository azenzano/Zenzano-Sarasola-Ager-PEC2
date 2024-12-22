// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "GSM944836_inf_lin", "S. aureus USA300", "hour 24", "linezolid", "inf_lin", "GSM944836" ], [ "2", "GSM944850_inf_lin", "S. aureus USA300", "hour 24", "linezolid", "inf_lin", "GSM944850" ], [ "3", "GSM944857_inf_lin", "S. aureus USA300", "hour 24", "linezolid", "inf_lin", "GSM944857" ], [ "4", "GSM944864_inf_lin", "S. aureus USA300", "hour 24", "linezolid", "inf_lin", "GSM944864" ], [ "5", "GSM944854_uni_lin", "uninfected", "hour 0", "linezolid", "uni_lin", "GSM944854" ], [ "6", "GSM944847_uni_lin", "uninfected", "hour 0", "linezolid", "uni_lin", "GSM944847" ], [ "7", "GSM944840_uni_lin", "uninfected", "hour 0", "linezolid", "uni_lin", "GSM944840" ], [ "8", "GSM944861_uni_lin", "uninfected", "hour 0", "linezolid", "uni_lin", "GSM944861" ], [ "9", "GSM944835_inf_unt", "S. aureus USA300", "hour 24", "untreated", "inf_unt", "GSM944835" ], [ "10", "GSM944849_inf_unt", "S. aureus USA300", "hour 24", "untreated", "inf_unt", "GSM944849" ], [ "11", "GSM944863_inf_unt", "S. aureus USA300", "hour 24", "untreated", "inf_unt", "GSM944863" ], [ "12", "GSM944856_inf_unt", "S. aureus USA300", "hour 24", "untreated", "inf_unt", "GSM944856" ], [ "13", "GSM944845_uni_unt", "uninfected", "hour 0", "untreated", "uni_unt", "GSM944845" ], [ "14", "GSM944852_uni_unt", "uninfected", "hour 0", "untreated", "uni_unt", "GSM944852" ], [ "15", "GSM944859_uni_unt", "uninfected", "hour 0", "untreated", "uni_unt", "GSM944859" ], [ "16", "GSM944838_uni_unt", "uninfected", "hour 0", "untreated", "uni_unt", "GSM944838" ], [ "17", "GSM944865_inf_van", "S. aureus USA300", "hour 24", "vancomycin", "inf_van", "GSM944865" ], [ "18", "GSM944837_inf_van", "S. aureus USA300", "hour 24", "vancomycin", "inf_van", "GSM944837" ], [ "19", "GSM944851_inf_van", "S. aureus USA300", "hour 24", "vancomycin", "inf_van", "GSM944851" ], [ "20", "GSM944858_inf_van", "S. aureus USA300", "hour 24", "vancomycin", "inf_van", "GSM944858" ], [ "21", "GSM944841_uni_van", "uninfected", "hour 0", "vancomycin", "uni_van", "GSM944841" ], [ "22", "GSM944855_uni_van", "uninfected", "hour 0", "vancomycin", "uni_van", "GSM944855" ], [ "23", "GSM944862_uni_van", "uninfected", "hour 0", "vancomycin", "uni_van", "GSM944862" ], [ "24", "GSM944848_uni_van", "uninfected", "hour 0", "vancomycin", "uni_van", "GSM944848" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}