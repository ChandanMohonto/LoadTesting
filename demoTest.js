import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the base URL and user IDs (replace with actual values)
const baseURL = 'http://127.0.0.1:8080';  // Corrected base URL
const userA = '91834';  // Replace with actual user A ID
const userB = '52123';  // Replace with actual user B ID

// Define the endpoints for sending, approving, checking status, unfriending, declining, canceling, and retrieving requests
const sendEndpoint = `/friendship/api/send?from=${userA}&to=${userB}`;
const approveEndpoint = `/friendship/api/approve?from=${userB}&to=${userA}`;
const statusEndpoint = `/friendship/api/status?userA=${userA}&userB=${userB}`;
const unfriendEndpoint = `/friendship/api/unfriend?from=${userA}&to=${userB}`;
const declineEndpoint = `/friendship/api/decline?from=${userB}&to=${userA}`;
const cancelEndpoint = `/friendship/api/cancel?from=${userA}&to=${userB}`;
const friendsEndpoint = `/stargate/api/friends/${userA}`;  // Endpoint for getting the list of friends
const sentRequestsEndpoint = `/stargate/api/requests/sent/${userA}`;  // Endpoint for getting sent friend requests
const receivedRequestsEndpoint = `/stargate/api/requests/received/${userB}`;  // Endpoint for getting received friend requests

export let options = {
  vus: 100,  // Virtual users
  duration: '30s',  // Test duration or u can use 1 m
  rps: 30,  // Requests per second
};

export default function () {
  // Send a friendship request
  const sendRes = http.get(`${baseURL}${sendEndpoint}`);
  
  // Check the response for sending the request
  check(sendRes, {
    'send request is status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'send request message is correct': (r) => r.status === 400 ? r.json().message === "There is already pending request" : r.status === 200 && r.json().message === "Friend request approved successfully",
  });

  // Approve the friendship request
  const approveRes = http.get(`${baseURL}${approveEndpoint}`);
  
  // Check the response for approving the request
  check(approveRes, {
    'approve request is status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'approve request message is correct': (r) => r.status === 400 ? r.json().message === "Request was approved already" : r.status === 200 && r.json().message === "Friend request approved successfully",
  });

  // Check the status of the friendship
  const statusRes = http.get(`${baseURL}${statusEndpoint}`);
  
  // Check the response for status
  check(statusRes, {
    'status request is status 200': (r) => r.status === 200,
    'status message is correct': (r) => {
      const body = r.json();
      return body.status === 'friends' || body.status === 'pending';
    },
  });

  // Unfriend the users
  const unfriendRes = http.get(`${baseURL}${unfriendEndpoint}`);
  
  // Check the response for unfriend
  check(unfriendRes, {
    'unfriend request is status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'unfriend message is correct': (r) => r.status === 400 ? r.json().message === "Users are not friends" : r.status === 200 && r.json().message === "Unfriended successfully",
  });

  // Decline the friendship request
  const declineRes = http.get(`${baseURL}${declineEndpoint}`);
  
  // Check the response for decline
  check(declineRes, {
    'decline request is status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'decline message is correct': (r) => r.status === 400 ? r.json().message === "There is no request to decline" : r.status === 200 && r.json().message === "Friend request declined successfully",
  });

  // Cancel the friendship request
  const cancelRes = http.get(`${baseURL}${cancelEndpoint}`);
  
  // Check the response for cancel
  check(cancelRes, {
    'cancel request is status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'cancel message is correct': (r) => r.status === 400 ? r.json().message === "There is no request to cancel" : r.status === 200 && r.json().message === "Friend request cancelled successfully",
  });

  // Get the list of friends
  const friendsRes = http.get(`${baseURL}${friendsEndpoint}`);
  
  // Check the response for friends
  check(friendsRes, {
    'friends request is status 200': (r) => r.status === 200,
    'friends message is correct': (r) => {
      const body = r.json();
      return Array.isArray(body.friends);  // Assuming 'friends' is an array in the response
    },
  });

  // Get the sent friend requests
  const sentRequestsRes = http.get(`${baseURL}${sentRequestsEndpoint}`);
  
  // Check the response for sent requests
  check(sentRequestsRes, {
    'sent requests request is status 200': (r) => r.status === 200,
    'sent requests message is correct': (r) => {
      const body = r.json();
      return Array.isArray(body.requests);  // Assuming 'requests' is an array in the response
    },
  });

  // Get the received friend requests
  const receivedRequestsRes = http.get(`${baseURL}${receivedRequestsEndpoint}`);
  
  // Check the response for received requests
  check(receivedRequestsRes, {
    'received requests request is status 200': (r) => r.status === 200,
    'received requests message is correct': (r) => {
      const body = r.json();
      return Array.isArray(body.requests);  // Assuming 'requests' is an array in the response
    },
  });

  sleep(0.6);  // Simulate a delay between requests
}
