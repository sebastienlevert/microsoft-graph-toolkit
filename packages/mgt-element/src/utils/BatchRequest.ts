/**
 * Represents a request to be executed in a batch
 *
 * @class BatchRequest
 */

export class BatchRequest {
  /**
   * url used in request
   *
   * @type {string}
   * @memberof BatchRequest
   */
  public resource: string;

  /**
   * method passed to be requested
   *
   * @type {string}
   * @memberof BatchRequest
   */
  public method: string;

  /**
   * The index of the requests as it was added to the queue
   * Use this value if you need to sort the responses
   * in the order they were added
   *
   * @type {number}
   * @memberof BatchRequest
   */
  public index: number;

  /**
   * The headers of the request
   *
   * @type {{[headerName: string]: string}}
   * @memberof BatchRequest
   */
  public headers: { [header: string]: string };

  /**
   * The id of the requests
   *
   * @type {string}
   * @memberof BatchRequest
   */
  public id: string;

  constructor(index: number, id: string, resource: string, method: string) {
    if (resource.charAt(0) !== '/') {
      resource = '/' + resource;
    }
    this.resource = resource;
    this.method = method;
    this.index = index;
    this.id = id;
  }
}