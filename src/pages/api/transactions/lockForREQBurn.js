// src/pages/api/transactions/[address].js
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ message: 'Invalid address' });
  }

  try {
    // Use Alchemy API key from environment variables (server-side only)
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    
    if (!alchemyApiKey) {
      console.error('ALCHEMY_API_KEY not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Connect to Gnosis Chain via Alchemy
    const provider = new ethers.JsonRpcProvider(`https://gnosis-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);

    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    
    // Search through recent blocks to find transactions
    const transactions = [];
    const blocksToSearch = 1000; // Search last 1000 blocks
    
    for (let blockNum = latestBlock; blockNum > latestBlock - blocksToSearch && transactions.length < 10; blockNum--) {
      try {
        const block = await provider.getBlock(blockNum, true);
        
        if (block && block.transactions) {
          for (const tx of block.transactions) {
            if (transactions.length >= 10) break;
            
            // Check if transaction involves our address (from or to)
            if (tx.from?.toLowerCase() === address.toLowerCase() || 
                tx.to?.toLowerCase() === address.toLowerCase()) {
              
              // Get transaction receipt for status
              const receipt = await provider.getTransactionReceipt(tx.hash);
              
              transactions.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: ethers.formatEther(tx.value || '0'),
                gasUsed: receipt?.gasUsed?.toString() || '0',
                gasPrice: ethers.formatUnits(tx.gasPrice || '0', 'gwei'),
                blockNumber: tx.blockNumber,
                timestamp: block.timestamp,
                status: receipt?.status === 1 ? 'success' : 'failed',
                type: tx.from?.toLowerCase() === address.toLowerCase() ? 'outgoing' : 'incoming'
              });
            }
          }
        }
      } catch (blockError) {
        // Skip this block if there's an error
        continue;
      }
    }

    // Sort by block number (most recent first)
    transactions.sort((a, b) => b.blockNumber - a.blockNumber);

    // Calculate total xDAI drained (outgoing transactions)
    const totalDrained = transactions
      .filter(tx => tx.type === 'outgoing')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0);

    res.status(200).json({
      transactions: transactions.slice(0, 10),
      totalDrained,
      address,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}