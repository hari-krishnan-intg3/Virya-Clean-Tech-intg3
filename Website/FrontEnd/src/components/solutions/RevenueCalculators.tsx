import { useState } from 'react';
import { Fuel, PlugZap } from 'lucide-react';

type NumberFieldProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min = 0, max, step = 1, unit, onChange }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className="relative block">
        <input
          className="field pr-20"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Math.max(min, Number(event.currentTarget.value) || 0))}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">
            {unit}
          </span>
        )}
      </span>
    </label>
  );
}

function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${emphasis ? 'border-emerald-500/30 bg-emerald-950/40' : 'border-white/10 bg-white/[0.03]'}`}>
      <p className="text-xs font-semibold text-ink-muted">{label}</p>
      <p className={`mt-1 font-mono text-lg font-bold ${emphasis ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

const inr = (amount: number) =>
  `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function RevenueCalculators() {
  const [chargerPorts, setChargerPorts] = useState(12);
  const [sessionsPerPort, setSessionsPerPort] = useState(5);
  const [energyPerSession, setEnergyPerSession] = useState(28);
  const [customerTariff, setCustomerTariff] = useState(20);
  const [energyCost, setEnergyCost] = useState(9);
  const [stationDays, setStationDays] = useState(360);
  const [stationOpex, setStationOpex] = useState(1800000);
  const [stationCapex, setStationCapex] = useState(18000000);

  const annualEnergySold = chargerPorts * sessionsPerPort * energyPerSession * stationDays;
  const stationRevenue = annualEnergySold * customerTariff;
  const stationEnergyCost = annualEnergySold * energyCost;
  const stationOperatingSurplus = stationRevenue - stationEnergyCost - stationOpex;
  const stationPayback = stationOperatingSurplus > 0 && stationCapex > 0
    ? stationCapex / stationOperatingSurplus
    : null;

  const [fuelCellKw, setFuelCellKw] = useState(1000);
  const [utilization, setUtilization] = useState(50);
  const [fuelCellDays, setFuelCellDays] = useState(350);
  const [electricalEfficiency, setElectricalEfficiency] = useState(50);
  const [powerTariff, setPowerTariff] = useState(20);
  const [hydrogenPrice, setHydrogenPrice] = useState(200);
  const [fuelCellOpex, setFuelCellOpex] = useState(12000000);
  const [fuelCellCapex, setFuelCellCapex] = useState(120000000);

  const annualPowerSold = fuelCellKw * 24 * fuelCellDays * (utilization / 100);
  const hydrogenUsedKg = annualPowerSold / (33.33 * Math.max(0.01, electricalEfficiency / 100));
  const hydrogenRevenue = annualPowerSold * powerTariff;
  const hydrogenFuelCost = hydrogenUsedKg * hydrogenPrice;
  const hydrogenOperatingSurplus = hydrogenRevenue - hydrogenFuelCost - fuelCellOpex;
  const hydrogenPayback = hydrogenOperatingSurplus > 0 && fuelCellCapex > 0
    ? fuelCellCapex / hydrogenOperatingSurplus
    : null;

  return (
    <section id="revenue-calculators" className="section scroll-mt-24 border-b border-line bg-white">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow"><span className="rule-accent" />Revenue planning</p>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            Charging and hydrogen revenue calculators
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Estimate annual sales, operating surplus, and simple payback from your own utilization, tariffs, fuel costs, and project investment.
          </p>
          <nav aria-label="Revenue calculators" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a className="text-emerald-700 hover:text-emerald-900" href="#station-revenue">EV charging station revenue</a>
            <a className="text-emerald-700 hover:text-emerald-900" href="#hydrogen-revenue">Hydrogen fuel-cell revenue</a>
          </nav>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <article id="station-revenue" className="card scroll-mt-24 p-6 shadow-soft sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-700">
                <PlugZap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold text-ink">EV Charging Station Revenue Calculator</h3>
                <p className="text-xs text-ink-faint">Public or destination charging sites</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <NumberField label="Charging ports" value={chargerPorts} min={1} step={1} onChange={setChargerPorts} />
              <NumberField label="Sessions per port / day" value={sessionsPerPort} step={0.5} onChange={setSessionsPerPort} />
              <NumberField label="Energy per session" value={energyPerSession} step={1} unit="kWh" onChange={setEnergyPerSession} />
              <NumberField label="Customer charging tariff" value={customerTariff} step={0.5} unit="₹/kWh" onChange={setCustomerTariff} />
              <NumberField label="Purchased electricity cost" value={energyCost} step={0.5} unit="₹/kWh" onChange={setEnergyCost} />
              <NumberField label="Operating days per year" value={stationDays} min={1} max={366} step={1} unit="days" onChange={(value) => setStationDays(Math.min(366, value))} />
              <NumberField label="Annual site operating costs" value={stationOpex} step={100000} unit="₹/year" onChange={setStationOpex} />
              <NumberField label="Installed project investment" value={stationCapex} step={500000} unit="₹" onChange={setStationCapex} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric label="Annual energy sold" value={`${Math.round(annualEnergySold).toLocaleString('en-IN')} kWh`} />
              <Metric label="Annual charging revenue" value={inr(stationRevenue)} />
              <Metric label="Energy purchase cost" value={inr(stationEnergyCost)} />
              <Metric label="Operating surplus before tax / debt" value={inr(stationOperatingSurplus)} emphasis />
              <Metric label="Simple project payback" value={stationPayback ? `${stationPayback.toFixed(1)} years` : 'No positive surplus'} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              Screening estimate. Excludes demand charges, payment fees, taxes, financing, and charger replacement; site utilization and tariffs require validation.
            </p>
          </article>

          <article id="hydrogen-revenue" className="card scroll-mt-24 p-6 shadow-soft sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/10 text-sky-700">
                <Fuel className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold text-ink">Hydrogen Fuel-Cell Revenue Calculator</h3>
                <p className="text-xs text-ink-faint">Electricity sales from a hydrogen fuel-cell plant</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <NumberField label="Fuel-cell rated output" value={fuelCellKw} min={1} step={50} unit="kW" onChange={setFuelCellKw} />
              <NumberField label="Annual utilization" value={utilization} min={0} max={100} step={1} unit="%" onChange={(value) => setUtilization(Math.min(100, value))} />
              <NumberField label="Operating days per year" value={fuelCellDays} min={1} max={366} step={1} unit="days" onChange={(value) => setFuelCellDays(Math.min(366, value))} />
              <NumberField label="Electrical efficiency" value={electricalEfficiency} min={1} max={100} step={1} unit="% LHV" onChange={(value) => setElectricalEfficiency(Math.min(100, value))} />
              <NumberField label="Electricity sale tariff" value={powerTariff} step={0.5} unit="₹/kWh" onChange={setPowerTariff} />
              <NumberField label="Delivered hydrogen price" value={hydrogenPrice} step={10} unit="₹/kg" onChange={setHydrogenPrice} />
              <NumberField label="Annual plant operating costs" value={fuelCellOpex} step={500000} unit="₹/year" onChange={setFuelCellOpex} />
              <NumberField label="Installed project investment" value={fuelCellCapex} step={1000000} unit="₹" onChange={setFuelCellCapex} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric label="Annual electricity generated" value={`${Math.round(annualPowerSold).toLocaleString('en-IN')} kWh`} />
              <Metric label="Annual electricity revenue" value={inr(hydrogenRevenue)} />
              <Metric label="Estimated hydrogen consumed" value={`${Math.round(hydrogenUsedKg).toLocaleString('en-IN')} kg`} />
              <Metric label="Hydrogen fuel cost" value={inr(hydrogenFuelCost)} />
              <Metric label="Operating surplus before tax / debt" value={inr(hydrogenOperatingSurplus)} emphasis />
              <Metric label="Simple project payback" value={hydrogenPayback ? `${hydrogenPayback.toFixed(1)} years` : 'No positive surplus'} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              Hydrogen use is estimated from 33.33 kWh/kg LHV and the entered electrical efficiency. Screening estimate only; excludes heat credits, delivery losses, taxes, and financing.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}