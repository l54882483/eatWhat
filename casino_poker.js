(function(参数,使用模式){
	var 计时器
	,模式
	,停止时间
	,样式定义 = ['color:#000000','color:#307730','color:#AAAAAA','color:white; background-color:#77A8F3','color:white; background-color:#0055CC','color:white; background-color:#B03939']
	,显示信息 = function(信息,样式){if(!参数.是否在控制台输出信息){显示信息=function(){};return}console.info('%c'+信息,样式定义[~~样式])}
	,碰触元素 = function(选择器){$(选择器).trigger('tap')}
	,图字转换 = function(选择器){var _=$('div',选择器),__=_.size()-1,___=0;_.each(function(i,____){___+=~~____.className.split('_')[1]*Math.pow(10,__-i)});return ___}
	,画布事件 = function(事件名){$('#canv').trigger(事件名)}
	,画布事件2 = function(事件名){exportRoot["card_" + 事件名 + "_select"]=1}
	,转化百分数 = function(浮点数){return Math.round(浮点数*10000)/100+'%'}
	,是否显示 = function(选择器){return $(选择器).is(':visible')}
	,显示情况 = function(){var _=[],__=查阅.我的筹码();for(var k in 情况){_.push(k+': '+情况[k])}_.push('现在游戏筹码: '+__);_.push('累计筹码收益: '+(__-情况.初始游戏筹码));console.info(_.join('\n'))}
	,薛定谔的结论 = function(猜对时说,猜错时说){if(状态机.薛定谔的选择!=''){if((状态机.薛定谔的选择=='大' && 查阅.双倍卡片(1).点数 < 查阅.双倍卡片(2).点数) || (状态机.薛定谔的选择!='大' && 查阅.双倍卡片(1).点数 > 查阅.双倍卡片(2).点数)){情况.薛定谔猜对次数++;显示信息(猜对时说)}else{情况.薛定谔猜错次数++;显示信息(猜错时说)}状态机.薛定谔的选择=''}}
	,状态机 = {
		运行中:false,
		牌桌阶段:0,
		双倍阶段:0,
		双倍累积:0,
		最后的选择:'',
		薛定谔的选择:''
	}
	,情况 = {
		脚本启动时间:new Date().toLocaleString(),
		最后一次操作:'未操作',
		每局筹码:0,
		双倍最高回数:0,
		累计牌桌游戏次数:0,
		累计双倍游戏次数:0,
		累计双倍赌对次数:0,
		累计双倍赌错次数:0,
		薛定谔猜对次数:0,
		薛定谔猜错次数:0,
		初始游戏筹码:0
	}
	,更新操作记录 = function(){情况.最后一次操作=new Date().toLocaleString()}
	,概率 = {}
	,生成概率 = function(){for(var 点数=2;点数<=14;点数++){
		概率[点数]={小:(点数-2)/12,大:1-(点数-2)/12}
	}}
	,样本 = {过期时间:0,数据:{}}
	,显示样本 = function(){var _={};for(var k in 样本.数据){var __=样本.数据[k],___=样本概率(k),_____={};for(var k2 in __){_____[k2]=__[k2]}_____.可信度=转化百分数(___.可信度),_____.出大概率=转化百分数(___.大),_____.出大基准=转化百分数(概率[k].大),_____.出小概率=转化百分数(___.小),_____.出小基准=转化百分数(概率[k].小);_[k]=_____}console.table(_);return '样本过期时间: '+new Date(样本.过期时间).toLocaleString()}
	,创建样本 = function(点数){样本.数据[点数]={总:0,大:0,小:0,平:0}}
	,从本地存储中读取样本 = function(){var _=localStorage['wg_casino_poker_samples'];if(_){样本=JSON.parse(_)}}
	,将样本保存到本地存储 = function(){localStorage['wg_casino_poker_samples']=JSON.stringify(样本)}
	,检查样本过期 = function(){if(new Date().getTime()>样本.过期时间){var _=new Date();if(_.getHours()>=参数.收集的样本在每天几点时过期){_=new Date(_.getTime()+24*60*60*1000)}_.setHours(参数.收集的样本在每天几点时过期),_.setMinutes(0),_.setSeconds(0),_.setMilliseconds(0);样本={过期时间:_.getTime(),数据:{}}}}
	,记录样本 = function(){检查样本过期();var 点数=查阅.双倍卡片(1).点数,结果=查阅.双倍卡片(2).点数;if(!(点数 in 样本.数据)){创建样本(点数)}样本.数据[点数].总++;if(结果>点数){样本.数据[点数].大++}else if(结果<点数){样本.数据[点数].小++}else{样本.数据[点数].平++}将样本保存到本地存储()}
	,样本概率 = function(点数){var _=样本.数据[点数];if(_.总-_.平==0){return null}_=_.小/(_.总-_.平);return {小:_,大:1-_,可信度:Math.min(1,样本.数据[点数].总/参数.样本可信度分母)}}
	,卡片类 = function(原始数据,位置){
		var _ = 原始数据.split('_');
		this.花色 = ~~_[0];
		this.点数 = ~~_[1];
		if(this.点数==1){this.点数=14}
		this.位置 = 位置+1;
	}
	,牌组操作 = {
		转换:function(原始数组){return 原始数组.map(function(v,i){return new 卡片类(v,i)})},
		排序:function(牌组,属性){for(var i=0,l=牌组.length;i<l;i++){for(var j=i+1;j<l;j++){if(牌组[i][属性]>牌组[j][属性]){var _=牌组[j];牌组[j]=牌组[i];牌组[i]=_}}}}
	}
	,查阅 = {
		牌桌卡片:function(){return 牌组操作.转换(cards_1_Array)},
		双倍卡片:function(i){return new 卡片类(window['doubleUp_card_'+i],0)},
		桌上筹码:function(){return 图字转换('.prt-bet')},
		我的筹码:function(){return 图字转换('.prt-medal')}
	}
	,判断 = {
		可START:function(){return 是否显示('.prt-start')},
		可OK:function(){return 是否显示('.prt-ok')},
		可YESNO:function(){return 是否显示('.prt-yes')},
		可HIGHLOW:function(){return 是否显示('.prt-double-select')},
	}
	,动作 = {
		点击START:function(){显示信息('点击START',1);更新操作记录();碰触元素('.prt-start')},
		点击OK:function(){显示信息('点击OK',1);更新操作记录();碰触元素('.prt-ok')},
		点击YES:function(){显示信息('点击YES',1);更新操作记录();碰触元素('.prt-yes')},
		点击NO:function(){显示信息('点击NO',1);更新操作记录();碰触元素('.prt-no')},
		点击HIGH:function(){显示信息('点击HIGH',1);更新操作记录();碰触元素('.prt-double-select[select=high]')},
		点击LOW:function(){显示信息('点击LOW',1);更新操作记录();碰触元素('.prt-double-select[select=low]')},
		保持第1张卡:function(){显示信息('保持第1张卡',1);画布事件('set1');画布事件2(1)},
		保持第2张卡:function(){显示信息('保持第2张卡',1);画布事件('set2');画布事件2(2)},
		保持第3张卡:function(){显示信息('保持第3张卡',1);画布事件('set3');画布事件2(3)},
		保持第4张卡:function(){显示信息('保持第4张卡',1);画布事件('set4');画布事件2(4)},
		保持第5张卡:function(){显示信息('保持第5张卡',1);画布事件('set5');画布事件2(5)}
	}
	,人工知能 = {
		保持卡片:function(){
			var 牌组 = 查阅.牌桌卡片();
			牌组操作.排序(牌组,'点数');
			//如果有王牌，保持王牌；如果有对子或以上，保持对子；如果都没有，则先检查是否顺子，是则保持，否则保持同花色最多的牌。
			var 保持={},JOKER=false,对子=0,最小数=Infinity,顺子测试序列=[],同花={};
			for(var i=0,l=牌组.length;i<l;i++){
				if(牌组[i].花色 in 同花){
					同花[牌组[i].花色].push(牌组[i].位置);
				}else if(牌组[i].花色==99){
					JOKER = true;
					保持[牌组[i].位置]=true;
				}else{
					同花[牌组[i].花色]=[牌组[i].位置];
				}

				if(牌组[i+1] && 牌组[i].点数==牌组[i+1].点数){
					保持[牌组[i].位置]=true;
					保持[牌组[i+1].位置]=true;
					对子++;
				}

				if(牌组[i].点数!=99){
					if(牌组[i].点数<最小数){
						最小数 = 牌组[i].点数;
					}
					顺子测试序列[牌组[i].点数] = 牌组[i].位置;
				}
			}
			if(对子==0){
				var 最大同花数=0,最大同花色=0,顺子允许跳数=1,顺子启始下标=0,顺子结束下标=0,最大顺子长度=0;
				for(var k in 同花){if(同花[k].length>最大同花数){最大同花数=同花[k].length;最大同花色=k}}
				if(JOKER){最大同花数++;顺子允许跳数++}
				顺子测试序列 = 顺子测试序列.slice(最小数);
				for(var i=0,l=顺子测试序列.length;i<l;i++){
					if(顺子测试序列[i]==undefined){continue}
					var 当前跳数 = 0, 长度 = 0;
					for(var j=i;j<l;j++){
						if(长度>=5){
							break;
						}
						长度++;
						if(顺子测试序列[j]==undefined){
							当前跳数++;
							if(当前跳数>顺子允许跳数){
								break;
							}
						}
					}
					if(长度-当前跳数>最大顺子长度){
						最大顺子长度=长度-当前跳数;
						顺子启始下标=i;
						顺子结束下标=长度+i;
					}
				}
				if(JOKER){最大顺子长度++}
				显示信息('顺子'+最大顺子长度+'枚,同花'+最大同花数+'枚',2);
				if(最大顺子长度==5 || 最大同花数==5){
					保持={1:true,2:true,3:true,4:true,5:true};
				}else if(最大同花数>=最大顺子长度){
					for(var i=0,l=同花[最大同花色].length;i<l;i++){保持[同花[最大同花色][i]]=true}
				}else{
					for(var i=顺子启始下标;i<顺子结束下标;i++){if(顺子测试序列[i]!=undefined){保持[顺子测试序列[i]]=true}}
				}
			}
			return 保持;
		},
		选择大小:function(){
			var 卡片 = 查阅.双倍卡片(1);
			显示信息('キター!你的对手是:'+卡片,4);
			if(!(卡片.点数 in 样本.数据)){
				创建样本(卡片.点数);
			}
			if(参数.薛定谔陪你玩){
				var _=样本概率(卡片.点数),__=概率[卡片.点数];
				if(_ && 样本.数据[卡片.点数].总>=参数.模式设定[使用模式].样本收集几次后开始使用){
					显示信息('样本可信度'+转化百分数(_.可信度),2);
					显示信息('出大概率'+转化百分数(_.大)+', 基准'+转化百分数(__.大),2);
					显示信息('出小概率'+转化百分数(_.小)+', 基准'+转化百分数(__.小),2);
					if(_.大==__.大){
						var r = (_.大>_.小)?'大':'小';
						状态机.薛定谔的选择 = r;
						显示信息('完全的一致！薛定谔默默地选择了'+r);
					}else{
						var s = _.大*_.可信度 + __.大*(1-_.可信度);
						if(Math.abs(s-__.大)>=0.02+0.016*Math.abs(卡片.点数-参数.赌双倍的高低分水点数)){
							var r = (_.大>_.小)?'小':'大';
							状态机.薛定谔的选择 = r;
							显示信息('选择'+r+'！薛定谔毫不犹豫地作出了选择。');
						}else{
							var r = (_.大>_.小)?'大':'小';
							状态机.薛定谔的选择 = r;
							显示信息('太难以决择了...薛定谔犹豫了一下，还是选胸'+r+'的吧。');
						}
					}
				}else{
					显示信息('我还没有准备好！薛定谔生气地拒绝作出选择。');
				}
			}
			if(样本.数据[卡片.点数].总>=参数.模式设定[使用模式].样本收集几次后开始使用 && 样本.数据[卡片.点数].大!=样本.数据[卡片.点数].小){
				if(样本.数据[卡片.点数].小>样本.数据[卡片.点数].大){
					return 'LOW'
				}
				return 'HIGH'
			}
			if(卡片.点数>参数.赌双倍的高低分水点数){
				return 'LOW'
			}else if(卡片.点数<参数.赌双倍的高低分水点数){
				return 'HIGH'
			}
			return Math.random()>0.5?'HIGH':'LOW';
		},
		继续双倍:function(){
			var 卡片 = 查阅.双倍卡片(2);
			if(参数.模式设定[使用模式].允许一站到底 && 查阅.我的筹码()>=参数.模式设定[使用模式].本钱大于多少后开始一站到底){
				if(卡片.点数 in 样本.数据){
					if(样本.数据[卡片.点数].总>=参数.模式设定[使用模式].样本收集多少份才允许一站到底){
						显示信息('Fairy Fevering',2);
						return true
					}
				}
			}
			var 不继续数组 = 参数.模式设定[使用模式].赌双倍遇到这些点数就不要继续;
			if(状态机.双倍累积>=参数.模式设定[使用模式].赌双倍连续获胜几回合后进入谨慎状态 || 查阅.桌上筹码()>=参数.模式设定[使用模式].赌双倍胜筹码达到多少后进入谨慎状态){
				显示信息('AT-Field FullPower',2);
				不继续数组 = 参数.模式设定[使用模式].赌双倍谨慎状态下遇到这些点数就不要继续;
			}
			for(var i=0,l=不继续数组.length;i<l;i++){
				if(卡片.点数==不继续数组[i]){
					显示信息('Oh my god! 出现了不再继续的卡片:'+卡片,4);
					return false;
				}
			}
			return true;
		}
	}
	,自动值守 = {
		沉睡:function(呼出动作){var 沉睡时间=参数.模式设定[使用模式].点击动作延迟几秒+Math.random()*参数.模式设定[使用模式].随机增加的延迟秒数;显示信息('Relax! 我只睡'+Math.round(沉睡时间*10)/10+'秒',2);计时器=setTimeout(呼出动作,沉睡时间*1000)},
		牌桌:function(){
			switch(状态机.牌桌阶段){
				case 0:
					if(new Date().getTime()>=停止时间){
						预约启动();
						return;
					}
					if(判断.可START()){
						动作.点击START();
						情况.累计牌桌游戏次数++;
						状态机.牌桌阶段++;
					}
					自动值守.沉睡(自动值守.牌桌);
					break;
				case 1:
					if(判断.可OK()){
						if(!情况.每局筹码){
							情况.每局筹码 = 查阅.桌上筹码();
						}
						显示信息('桌上出现的卡片为:'+查阅.牌桌卡片().join(','),2);
						var 要保持的卡片位置 = 人工知能.保持卡片();
						for(var k in 要保持的卡片位置){
							动作['保持第'+k+'张卡']();
						}
						动作.点击OK();
						状态机.牌桌阶段++;
					}
					自动值守.沉睡(自动值守.牌桌);
					break;
				case 2:
					if(判断.可YESNO()){
						动作.点击YES();
						显示信息('进入双倍',3);
						状态机.牌桌阶段=0;
						情况.累计双倍游戏次数++;
						自动值守.沉睡(自动值守.双倍);
					}else if(判断.可START()){
						显示信息('失败',3);
						状态机.牌桌阶段=0;
						自动值守.牌桌();
					}else{
						自动值守.沉睡(自动值守.牌桌);
					}
					break;
			}
		},
		双倍:function(){
			switch(状态机.双倍阶段){
				case 0:
					if(判断.可HIGHLOW()){
						var 大小 = 人工知能.选择大小();
						状态机.最后的选择 = 大小;
						动作['点击'+大小]();
						状态机.双倍阶段++;
					}
					自动值守.沉睡(自动值守.双倍);
					break;
				case 1:
					if(判断.可YESNO()){
						记录样本();
						显示信息('愉♂悦吧!双赔获胜',4);
						状态机.双倍累积++;
						if(状态机.双倍累积>情况.双倍最高回数){
							情况.双倍最高回数=状态机.双倍累积;
						}
						情况.累计双倍赌对次数++;
						薛定谔的结论('我早就看到是这个结局了，像我这种天才少女怎么可能会有控制不了的概率呢？哦呵呵呵呵～\n薛定谔自豪地挺了挺胸。虽然她没有。','切！薛定谔在角落里嘟囔了一句。');
						var 筹码 = 查阅.桌上筹码();
						显示信息('累计赌对'+状态机.双倍累积+'回,当前筹码:'+筹码,5);
						if(参数.模式设定[使用模式].赌双倍连续获胜几回合后停止<=状态机.双倍累积 || 参数.模式设定[使用模式].赌双倍筹码达到多少后停止<=筹码){
							动作.点击NO();
							状态机.双倍累积=0;
							状态机.双倍阶段=0;
							自动值守.沉睡(自动值守.牌桌);
							return;
						}
						if(人工知能.继续双倍()){
							动作.点击YES();
							状态机.双倍阶段=0;
							自动值守.沉睡(自动值守.双倍);
						}else{
							var _=查阅.桌上筹码();
							动作.点击NO();
							显示信息('收入'+_,5);
							状态机.双倍阶段=0;
							状态机.双倍累积=0;
							自动值守.沉睡(自动值守.牌桌);
						}
					}else if(判断.可START()){
						记录样本();
						if((状态机.最后的选择=='HIGH' && 查阅.双倍卡片(1).点数 <= 查阅.双倍卡片(2).点数) || (状态机.最后的选择!='HIGH' && 查阅.双倍卡片(1).点数 >= 查阅.双倍卡片(2).点数)){
							显示信息('Oh my god! 达到回合上限',4);
							var _=查阅.桌上筹码();
							薛定谔的结论('我早就看到是这个结局了，像我这种天才少女怎么可能会有控制不了的概率呢？哦呵呵呵呵～\n薛定谔自豪地挺了挺胸。虽然她没有。','切！薛定谔在角落里嘟囔了一句。');
							显示信息('收入'+_,5);
							情况.累计双倍赌对次数++;
						}else{
							显示信息('Holy shit! 双倍失败! 出现的卡片是:'+查阅.双倍卡片(2),4);
							情况.累计双倍赌错次数++;
							薛定谔的结论('哇咔咔咔～活该！让你不听天才少女的忠告！\n薛定谔用非常亲切和蔼地表情对你说道。','这！这不可能！一定是CY使诈！薛定谔愤怒地一拳砸在你的屏幕上。');
						}
						状态机.双倍阶段=0;
						状态机.双倍累积=0;
						自动值守.牌桌();
					}else{
						自动值守.沉睡(自动值守.双倍);
					}
					break;
			}
		}
	}
	,启动 = function(){
		if(状态机.运行中){return;}
		情况.初始游戏筹码 = 查阅.我的筹码();
		停止时间 = new Date().getTime()+参数.模式设定[使用模式].自动值守不超过几小时*60*60*1000;
		状态机.运行中=true;
		自动值守.牌桌();
	}
	,预约启动 = function(){
		var 启动时间 = 参数.模式设定[使用模式].自动值守停止后休息几小时再继续值守+参数.模式设定[使用模式].随机增加的休息小时数*Math.random();
		显示信息('已停止值守，并在'+Math.round(启动时间*10)/10+'小时后重新值守',2);
		状态机.运行中=false;
		计时器 = setTimeout(启动,启动时间*60*60*1000);
	}
	,停止 = function(){
		clearTimeout(计时器);
		状态机.运行中=false;
	};
	卡片类.prototype.toString = function(){if(this.花色!=99){return ['黑桃','红桃','方块','草花'][this.花色-1]+(this.点数>10?['J','Q','K','A'][this.点数-11]:this.点数)}return 'JOKER'}
	生成概率();
	从本地存储中读取样本();
	window.wg={};
	Object.defineProperties(wg,{
		启动:{get:启动},
		停止:{get:停止},
		情况:{get:显示情况},
		样本:{get:显示样本}
	});
	if(参数.立即自动值守){
		启动();
	}
	return '进入'+参数.模式设定[使用模式].模式名;
})({
	模式设定:[
		{
			模式名:'稳妥模式',
			样本收集几次后开始使用:7,
			赌双倍遇到这些点数就不要继续:[8],
			赌双倍连续获胜几回合后进入谨慎状态:8,
			赌双倍胜筹码达到多少后进入谨慎状态:10000,
			赌双倍谨慎状态下遇到这些点数就不要继续:[6,7,8,9,10],
			赌双倍连续获胜几回合后停止:20,
			赌双倍筹码达到多少后停止:1500000,
			允许一站到底:false,
			本钱大于多少后开始一站到底:500000,
			样本收集多少份才允许一站到底:30,
			点击动作延迟几秒:1.5,
			随机增加的延迟秒数:1,
			自动值守不超过几小时:5,
			自动值守停止后休息几小时再继续值守:0,
			随机增加的休息小时数:0
		},
		{
			模式名:'双倍赌到底模式',
			样本收集几次后开始使用:15,
			赌双倍遇到这些点数就不要继续:[],
			赌双倍连续获胜几回合后进入谨慎状态:20,
			赌双倍胜筹码达到多少后进入谨慎状态:20000,
			赌双倍谨慎状态下遇到这些点数就不要继续:[7,8,9],
			赌双倍连续获胜几回合后停止:20,
			赌双倍筹码达到多少后停止:1500000,
			允许一站到底:true,
			本钱大于多少后开始一站到底:50000,
			样本收集多少份才允许一站到底:30,
			点击动作延迟几秒:1.5,
			随机增加的延迟秒数:1,
			自动值守不超过几小时:5,
			自动值守停止后休息几小时再继续值守:0.34,
			随机增加的休息小时数:0.21
		},
		{
			模式名:'挂机模式',
			样本收集几次后开始使用:9,
			赌双倍遇到这些点数就不要继续:[],
			赌双倍连续获胜几回合后进入谨慎状态:20,
			赌双倍胜筹码达到多少后进入谨慎状态:20000,
			赌双倍谨慎状态下遇到这些点数就不要继续:[7,8,9],
			赌双倍连续获胜几回合后停止:20,
			赌双倍筹码达到多少后停止:1500000,
			允许一站到底:true,
			本钱大于多少后开始一站到底:50000,
			样本收集多少份才允许一站到底:30,
			点击动作延迟几秒:2,
			随机增加的延迟秒数:5,
			自动值守不超过几小时:1.5,
			自动值守停止后休息几小时再继续值守:1.5,
			随机增加的休息小时数:0.5
		},
		{
			模式名:'双开模式',
			样本收集几次后开始使用:9,
			赌双倍遇到这些点数就不要继续:[],
			赌双倍连续获胜几回合后进入谨慎状态:20,
			赌双倍胜筹码达到多少后进入谨慎状态:20000,
			赌双倍谨慎状态下遇到这些点数就不要继续:[7,8,9],
			赌双倍连续获胜几回合后停止:20,
			赌双倍筹码达到多少后停止:1500000,
			允许一站到底:true,
			本钱大于多少后开始一站到底:50000,
			样本收集多少份才允许一站到底:30,
			点击动作延迟几秒:3,
			随机增加的延迟秒数:3,
			自动值守不超过几小时:5,
			自动值守停止后休息几小时再继续值守:0,
			随机增加的休息小时数:0
		}
	],
	收集的样本在每天几点时过期:4,
	样本可信度分母:48,
	赌双倍的高低分水点数:8,
	是否在控制台输出信息:true,
	立即自动值守:true,
	薛定谔陪你玩:true
},1);
