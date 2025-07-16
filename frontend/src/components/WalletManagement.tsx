import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { BrowserProvider } from 'ethers';
// import type { AppDispatch, RootState } from '../store/store';
// import { saveWalletAddress } from '../store/userSlice';
import { Button } from './Button';

export function WalletManagement() {
  // const dispatch: AppDispatch = useDispatch();
  // const { walletAddress } = useSelector((state: RootState) => state.user);
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Placeholder state
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("No wallet found. Please install a browser wallet.");
      return;
    }
    setIsConnecting(true);
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // dispatch(saveWalletAddress(address));
      setWalletAddress(address); // Set placeholder state

    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    // dispatch(saveWalletAddress(null));
    setWalletAddress(null); // Clear placeholder state
  };

  return (
    <div className="space-y-4">
        {walletAddress ? (
          <>
            <div className="p-4 border border-pebble rounded-md bg-sand">
              <div className="space-y-2 text-left">
                <p className="font-mono text-xs text-portola-green break-all leading-snug">
                  <strong className="font-sans text-steel text-sm block">Saved Address:</strong> {walletAddress}
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm" className="w-full" onClick={handleDisconnect}>
              Disconnect Wallet
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-center text-steel p-4">You have no wallet connected.</p>
            <Button
                variant="outline"
                className="w-full"
                onClick={handleConnectWallet}
                disabled={isConnecting}
            >
                {isConnecting ? 'Connecting...' : 'Connect and Save Wallet'}
            </Button>
          </div>
        )}
    </div>
  );
}