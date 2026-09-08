import { useEffect, useRef, useState } from "react";
import { Camera, Check, CheckCircle2, Loader2, Upload } from "lucide-react";
import Modal from "./Modal";
import { useAppStore } from "../../store/AppStoreContext";

const ID_TYPES = ["Passport", "National ID", "Driver's Licence"];
const ADDRESS_PROOF_TYPES = ["Bank Statement", "Utility Bill", "Government Correspondence", "Lease / Rental Agreement"];
const MONEY_RANGES = [
  "Under $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000 – $1,000,000",
  "Over $1,000,000",
];
const SOURCE_OPTIONS = ["Employment Income", "Business Ownership", "Investments", "Inheritance", "Savings", "Other"];
const TRADING_FREQUENCY = ["Daily", "Weekly", "Monthly", "Occasionally"];
const ACCOUNT_PURPOSE = ["Retirement Savings", "Wealth Growth", "Active Trading", "Diversification", "Other"];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]";

const STEP_TITLES = ["Personal Information", "Identity Verification", "Address Verification", "Financial Profile"];

function StepIndicator({ step }) {
  return (
    <div className="mb-1">
      <div className="flex items-center">
        {STEP_TITLES.map((title, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={title} className="flex flex-1 items-center last:flex-none">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                  done
                    ? "border-[#D62839] bg-[#D62839] text-white"
                    : active
                      ? "border-[#D62839] text-[#EF4444]"
                      : "border-white/15 text-[#6a6a6a]"
                }`}
              >
                {done ? <Check size={13} /> : n}
              </div>
              {i < STEP_TITLES.length - 1 && (
                <div className={`mx-1.5 h-0.5 flex-1 rounded-full ${done ? "bg-[#D62839]" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2.5 text-xs font-medium text-white">
        Step {step} of {STEP_TITLES.length}: <span className="text-[#B3B3B3]">{STEP_TITLES[step - 1]}</span>
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#B3B3B3]">{label}</label>
      <input type={type} required={required} value={value} onChange={onChange} className={inputClass} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required = true }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#B3B3B3]">{label}</label>
      <select required={required} value={value} onChange={onChange} className={inputClass}>
        <option value="" disabled className="bg-[#0a0a0c]">
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0a0a0c]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileField({ label, file, onChange }) {
  const ref = useRef(null);
  return (
    <div>
      <label className="text-xs font-medium text-[#B3B3B3]">{label}</label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="mt-1.5 flex w-full items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-3.5 py-2.5 text-xs text-[#B3B3B3] transition-colors hover:border-white/25 hover:text-white"
      >
        <Upload size={13} />
        {file?.name || "Upload image"}
      </button>
      <input ref={ref} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}

function LivenessCapture({ file, onCapture, onRetake }) {
  const [phase, setPhase] = useState(file ? "verified" : "idle"); // idle | streaming | verifying | verified | error
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => () => stopStream(), []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setPhase("streaming");
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setPhase("error");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    stopStream();
    onCapture({ name: "liveness-capture.png", data: canvas.toDataURL("image/png") });
    setPhase("verifying");
    setTimeout(() => setPhase("verified"), 1600);
  };

  const retake = () => {
    stopStream();
    onRetake();
    setPhase("idle");
  };

  return (
    <div>
      <label className="text-xs font-medium text-[#B3B3B3]">Selfie / Liveness Photo</label>
      <div className="mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {phase === "idle" && (
          <div className="flex flex-col items-center gap-2 p-5 text-center">
            <Camera size={20} className="text-[#B3B3B3]" />
            <p className="text-xs text-[#B3B3B3]">Take a live photo to verify it&apos;s really you.</p>
            <button
              type="button"
              onClick={startCamera}
              className="rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Start Camera
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center gap-2 p-5 text-center">
            <Camera size={20} className="text-red-400" />
            <p className="text-xs text-red-300">
              Camera access is required for liveness verification. Please allow camera access and try again.
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/5"
            >
              Try Again
            </button>
          </div>
        )}

        {phase === "streaming" && (
          <div className="relative">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video ref={videoRef} autoPlay playsInline muted className="h-52 w-full bg-black object-cover" />
            <button
              type="button"
              onClick={capture}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
            >
              Capture
            </button>
          </div>
        )}

        {(phase === "verifying" || phase === "verified") && file && (
          <div className="flex items-center gap-3 p-4">
            <img src={file.data} alt="Liveness capture" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              {phase === "verifying" ? (
                <p className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Loader2 size={13} className="animate-spin" />
                  Verifying…
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={13} />
                  Picture Verified
                </p>
              )}
              <button type="button" onClick={retake} className="mt-1 text-[11px] font-medium text-[#B3B3B3] hover:text-white">
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  country: "",
  address: "",
  phone: "",
  email: "",
  occupation: "",
  idType: "",
  idNumber: "",
  issuingCountry: "",
  issueDate: "",
  expiryDate: "",
  addressProofType: "",
  employer: "",
  annualIncome: "",
  netWorth: "",
  sourceOfIncome: "",
  sourceOfFunds: "",
  expectedDepositRange: "",
  tradingFrequency: "",
  accountPurpose: "",
};

export default function KycModal({ open, onClose }) {
  const { state, submitKyc } = useAppStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    ...initialForm,
    phone: state.profile.phone || "",
    email: state.profile.email || "",
  }));
  const [idDocument, setIdDocument] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [addressProofDocument, setAddressProofDocument] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter({ name: file.name, data: reader.result });
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStep(1);
    setForm({ ...initialForm, phone: state.profile.phone || "", email: state.profile.email || "" });
    setIdDocument(null);
    setSelfie(null);
    setAddressProofDocument(null);
  };

  const handleClose = () => {
    setSubmitted(false);
    reset();
    onClose();
  };

  const handleNext = () => {
    // Only the current step's fields are mounted, so this validates just
    // those — not the whole multi-step form.
    if (formRef.current && !formRef.current.reportValidity()) return;
    setStep((s) => Math.min(s + 1, STEP_TITLES.length));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) return;
    submitKyc({ ...form, idDocument, selfie, addressProofDocument });
    setSubmitted(true);
  };

  return (
    <Modal open={open} onClose={handleClose} title="KYC Verification" maxWidth="max-w-2xl">
      {submitted ? (
        <div className="text-center">
          <p className="text-sm leading-relaxed text-[#B3B3B3]">
            Your KYC information has been submitted. Please allow a few business days to process your
            information.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <StepIndicator step={step} />

          <div className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Full Legal Name" value={form.fullName} onChange={update("fullName")} />
                <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={update("dateOfBirth")} />
                <Field label="Nationality" value={form.nationality} onChange={update("nationality")} />
                <Field label="Country of Residence" value={form.country} onChange={update("country")} />
                <Field label="Residential Address" value={form.address} onChange={update("address")} />
                <Field label="Phone Number" type="tel" value={form.phone} onChange={update("phone")} />
                <Field label="Email Address" type="email" value={form.email} onChange={update("email")} />
                <Field label="Occupation / Employment Status" value={form.occupation} onChange={update("occupation")} />
              </div>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SelectField label="ID Type" value={form.idType} onChange={update("idType")} options={ID_TYPES} />
                  <Field label="ID Number" value={form.idNumber} onChange={update("idNumber")} />
                  <Field label="Issuing Country" value={form.issuingCountry} onChange={update("issuingCountry")} />
                  <Field label="Issue Date" type="date" value={form.issueDate} onChange={update("issueDate")} />
                  <Field label="Expiry Date" type="date" value={form.expiryDate} onChange={update("expiryDate")} />
                </div>
                <FileField label="Clear Image of ID" file={idDocument} onChange={handleFile(setIdDocument)} />
                <LivenessCapture file={selfie} onCapture={setSelfie} onRetake={() => setSelfie(null)} />
              </>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SelectField
                  label="Document Type"
                  value={form.addressProofType}
                  onChange={update("addressProofType")}
                  options={ADDRESS_PROOF_TYPES}
                />
                <FileField
                  label="Upload Document"
                  file={addressProofDocument}
                  onChange={handleFile(setAddressProofDocument)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Employer / Business Name" value={form.employer} onChange={update("employer")} />
                <SelectField label="Annual Income Range" value={form.annualIncome} onChange={update("annualIncome")} options={MONEY_RANGES} />
                <SelectField label="Estimated Net Worth Range" value={form.netWorth} onChange={update("netWorth")} options={MONEY_RANGES} />
                <SelectField label="Source of Income" value={form.sourceOfIncome} onChange={update("sourceOfIncome")} options={SOURCE_OPTIONS} />
                <SelectField label="Source of Funds" value={form.sourceOfFunds} onChange={update("sourceOfFunds")} options={SOURCE_OPTIONS} />
                <SelectField
                  label="Expected Deposit / Transaction Range"
                  value={form.expectedDepositRange}
                  onChange={update("expectedDepositRange")}
                  options={MONEY_RANGES}
                />
                <SelectField
                  label="Expected Trading Frequency"
                  value={form.tradingFrequency}
                  onChange={update("tradingFrequency")}
                  options={TRADING_FREQUENCY}
                />
                <SelectField label="Purpose of Account" value={form.accountPurpose} onChange={update("accountPurpose")} options={ACCOUNT_PURPOSE} />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Back
              </button>
            )}
            {step < STEP_TITLES.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                Submit for Verification
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
