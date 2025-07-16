// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import type { TransactionReceipt } from 'ethers';
// import type { AppDispatch, RootState } from '../store/store';
// import { addPendingTransaction, updateTransactionStatus } from '../store/activitySlice';
// import { setConnecting, setConnected, setError, setUsdcBalance, setNativeBalance } from '../store/walletSlice';
import { Modal } from './Modal';
import { Button } from './Button';
import { DollarAmountInput } from './DollarAmountInput';

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint amount) returns (bool)",
];
const RECIPIENT_ADDRESS = "0x1b980Cd24839Ab9EA16460D0107b3fA3793D55cf";

interface StablecoinPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StablecoinPaymentModal({ isOpen, onClose }: StablecoinPaymentModalProps) {
  // const dispatch: AppDispatch = useDispatch();
  // const loan = useSelector((state: RootState) => state.loan);
  // const { address, status, networkName, usdcBalance, nativeBalance } = useSelector((state: RootState) => state.wallet);
  const loan = { nextPaymentAmount: 100.00 }; // Placeholder
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [partialAmount, setPartialAmount] = useState('');
  const [showPartialInput, setShowPartialInput] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'prompting' | 'sent'>('idle');

  const handleConnectWallet = async () => {
    if (!(window as any).ethereum) {
      setError("No wallet found. Please install a browser wallet.");
      return;
    }
    try {
      setStatus('connecting');
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();
      setAddress(userAddress);
      setNetworkName(network.name);
      setStatus('connected');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (isOpen && status === 'connected' && address) {
      const fetchBalances = async () => {
        try {
          const provider = new BrowserProvider((window as any).ethereum);
          const nativeBal = await provider.getBalance(address);
          setNativeBalance(formatUnits(nativeBal, 18));

          const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, provider);
          const usdcBal = await usdcContract.balanceOf(address);
          const decimals = await usdcContract.decimals();
          setUsdcBalance(formatUnits(usdcBal, decimals));
        } catch (err) {
          console.error("Failed to fetch balances:", err);
        }
      };
      fetchBalances();
    }
  }, [isOpen, status, address]);

  const handlePayWithUSDC = async (amountToPay: string) => {
    if (!(window as any).ethereum || !amountToPay || parseFloat(amountToPay) <= 0) return;

    setTxStatus('prompting');
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, signer);
      const amountToSend = parseUnits(amountToPay, 6);

      const transferTx = await usdcContract.transfer(RECIPIENT_ADDRESS, amountToSend);

      setTxStatus('sent');
      // dispatch(addPendingTransaction({ amount: amountToPay, txHash: transferTx.hash }));
      console.log("Transaction sent:", transferTx.hash);

      setTimeout(() => handleClose(), 2000);

       transferTx.wait().then((receipt: TransactionReceipt | null) => {
        if (receipt?.status === 1) {
          // dispatch(updateTransactionStatus({ txHash: transferTx.hash, status: 'success' }));
          console.log("Transaction successful:", transferTx.hash);
        } else {
          // dispatch(updateTransactionStatus({ txHash: transferTx.hash, status: 'failed' }));
          console.log("Transaction failed:", transferTx.hash);
        }
      });
    } catch (err) {
      setTxStatus('idle');
      console.error("Payment failed:", err);
    }
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleClose = () => {
    setShowPartialInput(false);
    setTxStatus('idle');
    setPartialAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Pay with Stablecoin (USDC)">
      <div className="w-full space-y-4">
        {status !== 'connected' ? (
          <div className="text-center">
            <p className="font-serif mb-4">Please connect your wallet to pay with stablecoin.</p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConnectWallet}
              disabled={status === 'connecting'}
            >
              {status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            {error && <p className="text-sm text-center text-alert mt-2">{error}</p>}
          </div>
        ) : txStatus === 'sent' ? (
          <div className="text-center p-8">
            <h3 className="font-serif text-lg text-grass">✅ Transaction Sent!</h3>
            <p className="text-sm text-steel mt-2">
              You can track the progress in the Activity section. This window will close shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border border-pebble rounded-md bg-sand">
              <p className="font-sans text-sm text-steel">Connected Wallet</p>
              <div className="mt-2 text-left space-y-1">
                <p className="font-mono text-xs text-portola-green break-all leading-snug"><strong className="font-sans text-steel text-sm">Address:</strong> {address}</p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug"><strong className="font-sans text-steel text-sm">Network:</strong> {networkName}</p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug"><strong className="font-sans text-steel text-sm">ETH Balance:</strong> {nativeBalance ?? '...'}</p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug"><strong className="font-sans text-steel text-sm">USDC Balance:</strong> {usdcBalance ?? '...'}</p>
              </div>
            </div>
            <div className="p-4 border-2 border-dashed border-pebble rounded-md space-y-4">
              {!showPartialInput ? (
                <div className="space-y-3">
                  <Button variant="success" size="lg" className="w-full" onClick={() => handlePayWithUSDC(loan.nextPaymentAmount.toString())} disabled={txStatus !== 'idle'}>
                    {txStatus === 'prompting' ? 'Check Wallet...' : `Pay Next Payment (${formatCurrency(loan.nextPaymentAmount)})`}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => setShowPartialInput(true)} disabled={txStatus !== 'idle'}>
                    Pay Other Amount
                  </Button>
                </div>
              ) : (
                <div>
                  <DollarAmountInput label="Payment Amount (USDC)" value={partialAmount} onChange={(val) => setPartialAmount(val)} size="large" />
                  <Button variant="success" size="lg" className="w-full mt-2" onClick={() => handlePayWithUSDC(partialAmount)} disabled={!partialAmount || parseFloat(partialAmount) <= 0 || txStatus !== 'idle'}>
                    {txStatus === 'prompting' ? 'Check Wallet...' : 'Submit Partial Payment'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setShowPartialInput(false)} disabled={txStatus !== 'idle'}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}