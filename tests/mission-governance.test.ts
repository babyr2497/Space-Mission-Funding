import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock contract functions
const mockCreateProposal = vi.fn();
const mockCastVote = vi.fn();
const mockGetProposal = vi.fn();
const mockGetVote = vi.fn();

// Mock contract
const missionGovernance = {
  createProposal: mockCreateProposal,
  castVote: mockCastVote,
  getProposal: mockGetProposal,
  getVote: mockGetVote,
};

describe('MissionGovernance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('createProposal', () => {
    it('should create a new proposal', async () => {
      const proposalId = 1;
      const title = 'New Mission Proposal';
      const description = 'This is a proposal for a new space mission';
      const votingDuration = 100;
      
      mockCreateProposal.mockResolvedValue({ success: true });
      
      const result = await missionGovernance.createProposal(proposalId, title, description, votingDuration);
      
      expect(mockCreateProposal).toHaveBeenCalledWith(proposalId, title, description, votingDuration);
      expect(result).toEqual({ success: true });
    });
    
    it('should fail if proposal already exists', async () => {
      const proposalId = 1;
      const title = 'New Mission Proposal';
      const description = 'This is a proposal for a new space mission';
      const votingDuration = 100;
      
      mockCreateProposal.mockRejectedValue(new Error('Proposal already exists'));
      
      await expect(missionGovernance.createProposal(proposalId, title, description, votingDuration))
          .rejects.toThrow('Proposal already exists');
      
      expect(mockCreateProposal).toHaveBeenCalledWith(proposalId, title, description, votingDuration);
    });
  });
  
  describe('castVote', () => {
    it('should cast a vote for a proposal', async () => {
      const proposalId = 1;
      const voteFor = true;
      
      mockCastVote.mockResolvedValue({ success: true });
      
      const result = await missionGovernance.castVote(proposalId, voteFor);
      
      expect(mockCastVote).toHaveBeenCalledWith(proposalId, voteFor);
      expect(result).toEqual({ success: true });
    });
    
    it('should fail if voting is closed', async () => {
      const proposalId = 1;
      const voteFor = true;
      
      mockCastVote.mockRejectedValue(new Error('Voting is closed'));
      
      await expect(missionGovernance.castVote(proposalId, voteFor))
          .rejects.toThrow('Voting is closed');
      
      expect(mockCastVote).toHaveBeenCalledWith(proposalId, voteFor);
    });
    
    it('should fail if user has already voted', async () => {
      const proposalId = 1;
      const voteFor = true;
      
      mockCastVote.mockRejectedValue(new Error('User has already voted'));
      
      await expect(missionGovernance.castVote(proposalId, voteFor))
          .rejects.toThrow('User has already voted');
      
      expect(mockCastVote).toHaveBeenCalledWith(proposalId, voteFor);
    });
  });
  
  describe('getProposal', () => {
    it('should return proposal details', async () => {
      const proposalId = 1;
      const proposalDetails = {
        title: 'New Mission Proposal',
        description: 'This is a proposal for a new space mission',
        votesFor: 10,
        votesAgainst: 5,
        votingEndsAt: 1000,
      };
      
      mockGetProposal.mockResolvedValue(proposalDetails);
      
      const result = await missionGovernance.getProposal(proposalId);
      
      expect(mockGetProposal).toHaveBeenCalledWith(proposalId);
      expect(result).toEqual(proposalDetails);
    });
    
    it('should return null for non-existent proposal', async () => {
      const proposalId = 999;
      
      mockGetProposal.mockResolvedValue(null);
      
      const result = await missionGovernance.getProposal(proposalId);
      
      expect(mockGetProposal).toHaveBeenCalledWith(proposalId);
      expect(result).toBeNull();
    });
  });
  
  describe('getVote', () => {
    it('should return vote details for a user', async () => {
      const proposalId = 1;
      const voter = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const voteDetails = { vote: true };
      
      mockGetVote.mockResolvedValue(voteDetails);
      
      const result = await missionGovernance.getVote(proposalId, voter);
      
      expect(mockGetVote).toHaveBeenCalledWith(proposalId, voter);
      expect(result).toEqual(voteDetails);
    });
    
    it('should return null if user has not voted', async () => {
      const proposalId = 1;
      const voter = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      
      mockGetVote.mockResolvedValue(null);
      
      const result = await missionGovernance.getVote(proposalId, voter);
      
      expect(mockGetVote).toHaveBeenCalledWith(proposalId, voter);
      expect(result).toBeNull();
    });
  });
});

