/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * @returns a Promise that should be filled with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an
 * object. If the request has an error, the Promise should be rejected with an
 * object that contains the properties:
 * {number} status          The HTTP response status
 * {string} statusText      The statusText from the xhr request
 */
function fetchModelData(url) {
  return new Promise(function (resolve, reject) {
    // Make a fetch request
    fetch(url)
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          // If response is not ok, reject the promise withstatus info
          reject({ status: response.status, statusText: response.statusText });
          return;
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Resolve the promise with the parsed JSON data
        resolve({ data });
      })
      .catch((error) => {reject({ status: 500, statusText: error.message });});

    // console.log(url);
    // setTimeout(() => reject(new Error(
    //   { status: 501, statusText: "Not Implemented" })), 
    //   0
    // );
    // On Success return:
    // resolve({data: getResponseObject});
  });
}

export default fetchModelData;
