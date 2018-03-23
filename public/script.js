
import axios from 'axios';

Vue.component('mission-item', {
	props: ['myMissions'],
	template: `<div>
					<table>
						<tr v-for="(mission, index) in shownMissions">
							<td class="eight columns">{{ mission }}</td>
							<button v-on:click="deleteMission(index)">Delete?</button>
						</tr>
					</table>
			      	<ul class="pagination" v-if="showPagination">
			      		<li v-for="page in totalPages">
				      		<a v-on:click="changePage(page)" v-bind:class="{ active: currentPage == page }" >{{ page }}</a>
			      		</li>
			      	</ul>
			    </div>`,
	data: function(){
		return {
			currentPage: 1,
			missionsPerPage:7,
			showPagination:false,
			readyForCurrentPageChange: false,
				}
	},
	methods: {
		deleteMission(index){
				console.log("Mission" + index);
				this.$emit('missiondelete', index);

		},
		changePage(page){
				this.currentPage=page;
		},
	},
	computed: {
		shownMissionsStartIndex: function(){
			return (this.missionsPerPage*this.currentPage)-this.missionsPerPage;
		},
		shownMissionsEndIndex: function(){
			return (this.missionsPerPage*this.currentPage);
		},
		shownMissions: function(){
			return this.myMissions.slice(this.shownMissionsStartIndex, this.shownMissionsEndIndex);
		},
		totalPages: function(){
			return Math.floor((this.myMissions.length-1)/this.missionsPerPage)+1;
		},
	},
	watch: {
		myMissions: function(){
			if(this.myMissions.length>this.missionsPerPage){
				console.log("pages:" + this.totalPages);

				 this.showPagination= true;
			}
			else{
				 this.showPagination=false;
			}
		},
		totalPages: function(newVal, oldVal){
			if(newVal>oldVal){
				this.currentPage=this.totalPages;
			}
		}
	}

	
});




var vm = new Vue({
	el: '#app',
	data: {
		scrollName:"",
		scrollNameLoad:"",
		additionalMission: "",
		missions: [],
		overwrite:false,
		saveinputseen: false,
		savedseen: false,
		loadseen: false,
		errorseen:false,
		error:"",
		aboutseen: false
	},
	methods: {
		handleClick(e){
			e.preventDefault();
			if(this.additionalMission===""){
			}
			else{
			this.missions.push(this.additionalMission);
			this.additionalMission="";
			}
		},
		XHRsendMissions(){
			var _= this;
			var params = {"missions": this.missions, "scroll": this.scrollName, "overwrite": this.overwrite};
			axios.post('./api', params)
			.then(function(e){
				_.saveinputseen=false;
				_.savedseen=true;
			})
			.catch(function(e){
				console.log(e)
				if(e.response.status==500){
					_.scrollNameLoad=_.scrollName;
					console.log(e.response.data);
				}
				else if (e.response!==undefined){
					_.errorseen=true;
					_.error="Unable to save. Please try again." + e.message;
				}	
				else{
					_.errorseen=true;
					_.error="There was an error" + e.message;
				}
			});
		},
		XHRloadMissions(){
			var _= this;
			var param= {params:{"scroll": this.scrollNameLoad}};
			axios.get('./api', param)
			.then(function(res){
			_.missions=res.data[0].missions;
			_.loadseen=false;
			})
			.catch(function(e){
				_.errorseen=true;
				_.error="There was a problem retreiving the scroll" + e.message;
			});
		},
		deleteMission(payload){
				console.log("DELETED MOFOPFOOOO! Index:" + payload);
				this.missions.splice(payload, 1);

		},
		resetScroll(){
			this.savedseen=false;
			this.missions=[];
		},
		closeDialog(){
			this.saveinputseen=false;
			this.savedseen=false;
			this.loadseen=false;
			this.errorseen=false;
			this.loadScrollText="Load Scroll?";
			},
	},
	mounted: function(){
		this.$refs.missioninput.focus();
		this.$refs.missioninput.select();
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
		},
		saveScrollText: function(){
		if(this.scrollName==this.scrollNameLoad){
			if(this.scrollName==""  || this.scrollName==" "){
				return "Save Scroll?"
			}
			else{
				this.overwrite=true;
				return "Overwrite? Are you sure?";
			}
				
		}
				else{ return "Save Scroll?"}
		}
	}

	

})



// document.ready(){
// 	document.getElementById('textinput').focus();
// document.getElementById('textinput').select();
// }()


