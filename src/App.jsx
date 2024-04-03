import { useState } from "react";

function App() {
  const [assemblySrc, setAssemblySrc] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [format, setFormat] = useState("Hex");

  /**
   *
   * @param {string} instruction
   * @returns
   */
  function assemble(instruction) {
    const parts = instruction.split(" ");
    const opcode = getOpcode(parts[0]);

    if (
      opcode === "0000" ||
      opcode === "0001" ||
      opcode === "0010" ||
      opcode === "0011" ||
      opcode === "0100" ||
      opcode === "0101"
    ) {
      // Format R
      let rd = "";
      let rs = "";
      let rt = "";
      let shamt = "";

      rd = parts[1].substring(1);
      rs = parts[2].substring(1);

      if (parts[3].startsWith("r")) {
        rt = parts[3].substring(1);
      } else {
        shamt = parts[3];
      }

      let binInstruction = "";
      if (rt) {
        binInstruction =
          opcode +
          decToBin(rd, 4) +
          decToBin(rs, 4) +
          decToBin(rt, 4) +
          "0000000000000000";
      } else {
        binInstruction =
          opcode +
          decToBin(rd, 4) +
          decToBin(rs, 4) +
          "0000" +
          decToBin(shamt, 5) +
          "00000000000";
      }

      return binInstruction;
    } else if (
      opcode === "0110" ||
      opcode === "0111" ||
      opcode === "1000" ||
      opcode === "1001" ||
      opcode === "1010"
    ) {
      // Format I
      let rd = parts[1].substring(1);
      let rs;
      let immediate;

      if (parts.length === 4) {
        rs = parts[2].substring(1);
        immediate = parts[3];
      } else {
        [rs, immediate] = parts[2]
          .replace("[", " ")
          .replace("]", "")
          .split(" ");
        rs = rs.substring(1);
      }

      let result;

      if (parts[0] === "addi" || parts[0] === "lw" || parts[0] === "sw") {
        result =
          opcode +
          decToBin(rd, 4) +
          "0000" +
          decToBin(rs, 4) +
          decToBin(immediate, 16);
      } else if (parts[0] === "blt") {
        result =
          opcode +
          "0000" +
          decToBin(rd, 4) +
          decToBin(rs, 4) +
          decToBin(immediate, 16);
      } else {
        result =
          opcode +
          decToBin(rd, 4) +
          decToBin(rs, 4) +
          "0000" +
          decToBin(immediate, 16);
      }

      return result;
    } else if (opcode === "1011") {
      // Format J
      const address = decToBin(parts[1], 16);
      return opcode + "000000000000" + address;
    }

    return null; // Invalid instruction
  }

  function assembleAll(instructions) {
    return instructions
      .map((instruction) => assemble(instruction))
      .filter((binary) => binary !== null);
  }

  function getOpcode(instruction) {
    switch (instruction) {
      case "add":
        return "0000";
      case "sub":
        return "0001";
      case "mul":
        return "0010";
      case "sll":
        return "0011";
      case "or":
        return "0100";
      case "slt":
        return "0101";
      case "addi":
        return "0110";
      case "lw":
        return "0111";
      case "sw":
        return "1000";
      case "blt":
        return "1001";
      case "ori":
        return "1010";
      case "j":
        return "1011";
      default:
        return null; // Invalid instruction
    }
  }

  function decToBin(decimal, length) {
    return (decimal >>> 0).toString(2).padStart(length, "0");
  }

  function binaryToHex(binary) {
    const decimal = parseInt(binary, 2);
    const hexadecimal = decimal.toString(16).toUpperCase().padStart(8, "0");
    return hexadecimal;
  }

  /**
   *
   * @param {FormDataEvent} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    const assemblyLines = assemblySrc.split("\n").map((line) => line.trim());
    const resultBin = assembleAll(assemblyLines);
    const resultHex = resultBin.map((line) => binaryToHex(line));
    if (format === "Hex") {
      setResultCode(resultHex.toString().replaceAll(",", " "));
    } else {
      setResultCode(resultBin.toString().replaceAll(",", " "));
    }
  }

  return (
    <>
      <div className="bg-gray-1000 py-12">
        <div className="flex flex-col items-center gap-4 px-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              MIPS-Like Assembler
            </h1>
          </div>
          <div className="w-full max-w-[500px] space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex w-full items-center gap-4">
                <select
                  name="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option>Hex</option>
                  <option>Bin</option>
                </select>
                <button
                  className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  type="submit"
                >
                  Compile
                </button>
              </div>
              <div className="flex flex-col justify-center gap-6 md:flex-row">
                <div className="space-y-2">
                  <label
                    className="sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="text"
                  >
                    Enter assembly code
                  </label>
                  <textarea
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[200px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[50ch]"
                    id="text"
                    placeholder="Enter your text"
                    value={assemblySrc}
                    onChange={(e) => setAssemblySrc(e.target.value)}
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="sr-only" htmlFor="result">
                    Result
                  </label>
                  <textarea
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[200px] w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[50ch]"
                    id="result"
                    placeholder="Result"
                    readOnly
                    value={resultCode}
                    onChange={(e) => setResultCode(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
