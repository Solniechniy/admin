import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { networks, type NetworkConfig } from "@/config/networks";

interface NetworkSelectorProps {
  onNetworkChange: (network: NetworkConfig | null) => void;
  selectedNetwork: NetworkConfig | null;
}

export function NetworkSelector({
  onNetworkChange,
  selectedNetwork,
}: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Step 1: Select Network</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedNetwork ? selectedNetwork.name : "Select network..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search network..." />
            <CommandList>
              <CommandEmpty>No network found.</CommandEmpty>
              <CommandGroup>
                {networks.map((network) => (
                  <CommandItem
                    key={network.id}
                    value={network.id}
                    onSelect={() => {
                      onNetworkChange(network);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedNetwork?.id === network.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {network.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
