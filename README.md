<table>
<thead>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Example JSON Request Body Payload</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>GET</code></td>
<td><code>/</code></td>
<td>Health check</td>
<td>n/a</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/raffles</code></td>
<td>List all raffles</td>
<td>n/a</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/raffles</code></td>
<td>Create a raffle</td>
<td><code>{ "name": "My first Raffle", "secret_token": "s3CrE7" }</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/raffles/:id</code></td>
<td>Retrieve a raffle by id</td>
<td>n/a</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/raffles/:id/participants</code></td>
<td>Retrieve all participants of a raffle</td>
<td>n/a</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/raffles/:id/participants</code></td>
<td>Sign up a participant for a raffle</td>
<td><code>{ "firstname": "Jane", "lastname": "Doe", "email": "jdoe@email.com", "phone": "+1 (917) 555-1234", }</code></td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/raffles/:id/winner</code></td>
<td>Pick a winner from the participants at random for a raffle</td>
<td><code>{ "secret_token": "s3CrE7" }</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/raffles/:id/winner</code></td>
<td>Retrieve the winner of a raffle</td>
<td></td>
</tr>
</tbody>
</table>
