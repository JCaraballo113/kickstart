// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign  newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) agreers;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier contributor() {
      require(approvers[msg.sender]);
      _;
    }

    event Contributed(uint _minimumContribution, uint _balance, uint _approversCount, address indexed _manager);


    constructor(uint minimum, address creator) {
      manager = creator;

      minimumContribution = minimum;
    }

    function contribute() public payable {
      require(msg.value > minimumContribution);
      approvers[msg.sender] = true;
      approversCount++;
      emit Contributed(minimumContribution, address(this).balance, approversCount, manager);
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
      Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public contributor {
      Request storage request = requests[index];
      require(!request.agreers[msg.sender]);
      request.agreers[msg.sender] = true;
      request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
      Request storage r = requests[index];
      require(r.approvalCount > (approversCount / 2));
      require(!r.complete);
      r.recipient.transfer(r.value);
      r.complete = true;
    }

    function getSummary() public view returns(
      uint, uint, uint, uint, address
    ) {
      return(
        minimumContribution,
        address(this).balance,
        requests.length,
        approversCount,
        manager
      );
    }

    function getRequestsCount() public view returns (uint) {
      return requests.length;
    }

}
