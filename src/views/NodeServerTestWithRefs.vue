<template>

	<div>
		<h1>Vue 3 to Node Server</h1>
		<p><strong>GET Response:</strong> {{ serverMessage }}</p>
	</div>

	<table v-if="bankList && bankList.length > 0" class="cashier-banks">
		<tr class="header-row">
			<th>Id</th>
			<th>Bank Owner</th>
			<th>Casino Id</th>
			<th>Shift Number</th>
			<th>Open Date</th>
			<th>Close Date</th>
			<th>Regular AU</th>
			<th>Promo AU</th>
			<th v-if="bankHasAction">Actions</th>
		</tr>
		<tr class="data-row" v-for="(item, index) in bankList" :key="index" :class="item.bankOpen ? 'open' : 'closed'"
			:title="item.bankOpen ? 'Bank is open. Click an action on the right.' : 'closed'">
			<td style="overflow-wrap: normal">{{ item.id }}</td>
			<td>{{ item.cashierUserId }}</td>
			<td>{{ item.casinoId }}</td>
			<td>{{ item.shiftNumber }}</td>
			<td>{{ item.openDate }}</td>
			<td v-if="item.bankOpen" class="open-text">OPEN</td>
			<td v-else>{{ item.closeDate }}</td>
			<td>{{ item.currentBalance.regularAU }}</td>
			<td>{{ item.currentBalance.promoAU }}</td>
			<td v-if="item.bankOpen">
				<span v-if="item.currentUsersOpenBank" class="btn" @click="showCashierBank(item.id)">View</span>
				<span v-if="isSiteAdmin || item.currentUsersOpenBank" class="btn"
					@click="requestCloseCashierBank(item.id)">Close</span>
			</td>
		</tr>
	</table>


</template>

<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const serverMessage = ref('Loading...');
const responseStatus = ref('');

// 1. GET Request on component mount
onMounted(async () => {
	try {
		const response = await fetch('/api/contacts')
		const data = await response.json()
		serverMessage.value = data.message
		this.eventBus.emit("getUsers", data);
	} catch (error) {
		console.error('Error fetching data:', error)
		serverMessage.value = 'Failed to load server data.'
		this.eventBus.emit("getUsers", error);
	}
});

// 2. POST Request triggered by user action - NOT USED
async function sendData() {
	console.log("Clicked");
	try {
		let body = {
			userName: this.userName,
			password: this.password,
		}

		console.log(body);

		const response = await fetch('/api/contacts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		})
		const data = await response.json()
		responseStatus.value = `Server replied: ${data.message}`
	} catch (error) {
		console.error('Error posting data:', error)
	}
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>