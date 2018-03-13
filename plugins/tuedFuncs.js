var toArray = function() {
	var arr = null;
	try {
		arr = Array.prototype.slice.call(this, 0);
	} catch (e) {
		arr = new Array();
		for (var i = 0, len = this.length; i < len; i++) {
			arr.push(this[i]);
		}
	}
	return arr;
}


var getStyle = function(getStyle) {
	if(this.currentStyle){   	
		return this.currentStyle[getStyle];   
	}   
	else{   	
		return document.defaultView.getComputedStyle(this,null)[getStyle];   	
	} 
} 


var filterChildren = function(className) {
	var nodes=[];
	for (let node of this.children) {
		node.classList.contains(className) && nodes.push(node)
	}
	return nodes;
}


var siblings = function(className) {
	var nodes=[];
	var prev=this.previousSibling; 
	if (className) name=className.replace(/\./, '');

	while(prev){
		if(prev.nodeType===1 && (prev.classList.contains(name) || !name)){ 
			nodes.push(prev); 
		} 
		prev=prev.previousSibling; 
	} 
	nodes.reverse(); 
	var next=this.nextSibling; 
	while(next){ 
		if(next.nodeType===1 && (next.classList.contains(name) || !name)){ 
			nodes.push(next); 
		} 
		next=next.nextSibling; 
	} 
	return nodes; 
};


if(!("classList" in document.documentElement)) {  
	Object.defineProperty(HTMLElement.prototype, 'classList', {  
		get: function() {  
			var self = this;  
			function update(fn) {  
				return function(value) {  
					var classes = self.className.split(/\s+/g),  
					index = classes.indexOf(value);  
					
					fn(classes, index, value);  
					self.className = classes.join(" ");  
				}  
			}  
			return {                      
				add: update(function(classes, index, value) {  
					if (!~index) classes.push(value);  
				}),  
				
				remove: update(function(classes, index) {  
					if (~index) classes.splice(index, 1);  
				}),  
				
				toggle: update(function(classes, index, value) {  
					if (~index)  
						classes.splice(index, 1);  
					else  
						classes.push(value);  
				}),  
				
				contains: function(value) {  
					return !!~self.className.split(/\s+/g).indexOf(value);  
				},  
				
				item: function(i) {  
					return self.className.split(/\s+/g)[i] || null;  
				}  
			};  
		}  
	});  
} 

HTMLCollection.prototype.toArray = toArray;

if (window.HTMLElement) {
	HTMLElement.prototype.siblings = siblings;
	HTMLElement.prototype.getStyle = getStyle;
	HTMLElement.prototype.filterChildren = filterChildren;
} else {
	var elAll = document.all, lenAll = elAll.length;
	for (var iAll=0; iAll<lenAll; iAll+=1) {
		elAll[iAll].siblings = siblings;
		elAll[iAll].getStyle = getStyle;
		elAll[iAll].filterChildren = filterChildren;
	}
}


