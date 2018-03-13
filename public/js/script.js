

Vue.component('mission-item', {
	props: ['myMission'],
	template: '<table><tr v-for="mission in myMission"><td>{{ mission }}</td></tr></table>',
});





var vm = new Vue({
	el: '#app',
	data: {
		additionalMission: "",
		newMissionsThisSession:[],
		missions: [],
		currentPage: 1,
		totalPages: 1,
		missionsPerPage:7,
		seen: false,
		showPagination:false
	},
	methods: {
		handleClick(e){
			e.preventDefault();
			if(this.shownMissions.length == 7 ){
				this.showPagination=true;
				this.currentPage+=1;
				this.totalPages+=1;
			}	
				
			if(this.additionalMission===""){
			}
			else{
			this.newMissionsThisSession.push(this.additionalMission);
			this.missions.push(this.additionalMission);
			this.additionalMission="";
			}
			
		},
		saveMissions(e){
			e.preventDefault();
			var http = new XMLHttpRequest();
			var params = {"mission": this.newMissionsThisSession};
			var JSONparams= JSON.stringify(params);
			console.log(JSONparams);
			var http = new XMLHttpRequest();
			var url = "./api";
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/json");
			http.onload = () => {};
    		http.onerror = () => (http.statusText);
			http.send(JSONparams);
			this.seen=true;
		},
		resetScroll(){
			this.seen=false;
			this.missions=[];
		},
		closeDialog(){
			this.seen=false;
		},
		changePage(page){
			this.currentPage=page;
		}
		
	},
	mounted: function(){
		this.$refs.missioninput.focus();
		this.$refs.missioninput.select();
		console.log('total pates' + this.totalPages)
	},
	computed: {
		shownMissionsStartIndex: function(){
			return (this.missionsPerPage*this.currentPage)-this.missionsPerPage;
		},
		shownMissionsEndIndex: function(){
			return (this.missionsPerPage*this.currentPage);
		},
		shownMissions: function(){
			return this.missions.slice(this.shownMissionsStartIndex, this.shownMissionsEndIndex);
		}
	}

	

})



// document.ready(){
// 	document.getElementById('textinput').focus();
// document.getElementById('textinput').select();
// }()


