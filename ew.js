var MAX_RESTAURANT_NAME_LENGTH = 16;

var dataAccessFactory = function(key){
	var _data = [];
	if(localStorage[key]){
		_data = JSON.parse(localStorage[key]);
	}

	return {
		add: function(name){
			_data.push(name);
			this.save();
			return _data.length-1;
		},
		remove: function(index){
			_data.splice(index,1);
			this.save();
		},
		clear: function(){
			_data = [];
			this.save();
		},
		save: function(){
			localStorage[key] = JSON.stringify(_data);
		},
		get: function(index){
			return _data[index];
		},
		all: function(){
			return _data;
		},
		size: function(){
			return _data.length;
		}
	}
};

var dataRestaurants = dataAccessFactory('restaurants');
var dataRecord = dataAccessFactory('record');

var el = function(selector){
	return document.querySelector(selector);
};

var els = function(selector){
	return document.querySelectorAll(selector);
};

var removeClass = function(el,className){
	el.className = el.className.replace(' '+className,'');
};

var addClass = function(el,className){
	el.className += ' '+className;
};

var eventHandler = {
	addRestaurant: function(preorder){
		if(typeof preorder != 'string'){
			preorder = '';
		}
		var name = prompt('请填写吃饭场所的名字',preorder);
		if(!name){
			if(confirm('你没有填写名字，要取消添加吗？')){
				return;
			}
			eventHandler.addRestaurant();
			return;
		}
		if(name.length>MAX_RESTAURANT_NAME_LENGTH){
			alert(name+' 这个名字太长了，请修改到16文字以内。');
			eventHandler.addRestaurant(name);
			return;
		}
		dataRestaurants.add(name);
		eventHandler.refreshCounter();
	},
	sceneJump: function(sceneId){
		removeClass(el('.curr_scene'),'curr_scene');
		addClass(el(sceneId),'curr_scene');
	},
	gotoManager: function(){
		var l = dataRestaurants.size(), r = [];
		var template = el('[rel="manage_item"]').innerHTML;
		for(var i=0;i<l;i++){
			r.push(template.replace(/\{index\}/g,i).replace(/\{name\}/g,dataRestaurants.get(i)));
		}
		el('[rel="manage_list"]').innerHTML = r.join('');
		eventHandler.sceneJump('#manage');
	},
	gotoMain: function(){
		eventHandler.sceneJump('#main');
	},
	getDailyRestaurant: function(){
		if(dataRestaurants.size()==0){
			alert('你还没有添加过任何吃饭场所喔');
			return;
		}
		var r = Math.floor(dataRestaurants.size()*Math.random());
		el('[rel="dialy_title"]').innerText = dataRestaurants.get(r);
		eventHandler.sceneJump('#daily');
	},
	getWeeklyRestaurant: function(){
		var d = ~~el('[rel="weekly_days"]').value;
		if(d==0){
			alert('这周的天数好像？嗯？我在地球吗？');
			return;
		}
		if(dataRestaurants.size()==0){
			alert('你还没有添加过任何吃饭场所喔');
			return;
		}
		dataRecord.clear();
		var a = [], r = [];
		while(d>a.length){
			a = a.concat(dataRestaurants.all());
		}
		var template = el('[rel="weekly_cell"]').innerHTML;
		for(var i=0;i<d;i++){
			var idx = Math.floor(a.length*Math.random());
			var name = a[idx];
			dataRecord.add(name);
			r.push(template.replace(/\{date\}/g,i+1).replace(/\{name\}/g,name));
			a.splice(idx,1);
		}
		el('[rel="weekly_table"]').innerHTML = r.join('');
		eventHandler.sceneJump('#weekly');
	},
	showWeeklyRestaurant: function(){
		if(dataRecord.size()==0){
			alert('现在没有记录');
			return;
		}
		var r = [];
		var template = el('[rel="weekly_cell"]').innerHTML;
		for(var i=0;i<dataRecord.size();i++){
			var name = dataRecord.get(i);
			r.push(template.replace(/\{date\}/g,i+1).replace(/\{name\}/g,name));
		}
		el('[rel="weekly_table"]').innerHTML = r.join('');
		eventHandler.sceneJump('#weekly');
	},
	removeSelectedItems: function(){
		var selectedItems = els('[rel="list_item"]:checked');
		for(var i=selectedItems.length-1;i>=0;i--){
			var idx = ~~selectedItems[i].value;
			dataRestaurants.remove(idx);
		}
		eventHandler.refreshCounter();
		eventHandler.gotoManager();
	},
	refreshCounter: function(){
		el('[rel="restaurant_count"]').innerText = dataRestaurants.size();
	}
};

eventHandler.refreshCounter();
var backBtns = els('[rel="back_to_main"]');
for(var i=0,l=backBtns.length;i<l;i++){
	backBtns[i].addEventListener('click',eventHandler.gotoMain,false);
}

el('[rel="add_new_restaurant"]').addEventListener('click',eventHandler.addRestaurant,false);

el('[rel="create_menu_daily"]').addEventListener('click',eventHandler.getDailyRestaurant,false);

el('[rel="create_menu_weekly"]').addEventListener('click',eventHandler.getWeeklyRestaurant,false);

el('[rel="look_last_weekly_menu"]').addEventListener('click',eventHandler.showWeeklyRestaurant,false);

el('[rel="modify_exists_restaurants"]').addEventListener('click',eventHandler.gotoManager,false);

el('[rel="remove_selected_item"]').addEventListener('click',eventHandler.removeSelectedItems,false);