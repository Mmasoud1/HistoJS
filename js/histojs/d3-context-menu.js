 function contextMenu(menu, openCallback) {
    // Menu will only appear when Similar Tiles is on	
	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});
	

	// this gets executed when a contextmenu event occurs
	// return function(data, index) {	
		// console.log("data",data)
		var elm = this;
     
		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.style('background-color',function(d, i) {
			
				// if(d.title.split(" ")[0]=="SPX"){
				 if(i==0){	
				 	return 'grey';
				 }else{
                    return 'white';
				  }
			})
			.style('color',function(d, i) {
			 
				// if(d.title.split(" ")[0]=="SPX"){
				 if(i==0){	
				 	return 'white';
				 }else{
                    return 'black';
				 }
			})

			.on('click', function(d, i) {
				d.action(elm, d, i);
				d3.select('.d3-context-menu').style('display', 'none');
			})
			.on('mouseover', function(d, i) {
				 
                 if(i){
				    d3.select(this).style('background-color','#4677f8')
				 	d3.select(this).style('color','#fefefe')
				 }
 
			})
			.on('mouseleave', function(d, i) {
				 
                 if(i){
				    d3.select(this).style('background-color','white')
				 	d3.select(this).style('color','black')
				 }
 
			});

		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
		if (openCallback) openCallback(d,i);

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');

		d3.event.preventDefault();
	// };
  
};