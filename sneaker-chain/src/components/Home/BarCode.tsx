import { useBarcode } from "@createnextapp/react-barcode";

interface BarCodeProps {
  value: string;
}

export default function BarCode({ value }: BarCodeProps) {
  const { inputRef } = useBarcode({
    value: value,
  });

  return <svg ref={inputRef} />;
}
