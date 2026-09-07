"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPhotos } from "@/lib/photo-upload";

type ExistingPhoto = { url: string; caption: string; _remove?: boolean };
type TimelineDraft = {
  id: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  morningTime?: string;
  eveningTime?: string;
  presetKey?: string;
};

const PRESET_EVENTS: { key: string; title: string; summary: string }[] = [
  { key: "sthapana", title: "स्थापना", summary: "गणरायाचे आगमन आणि मंगलमय स्थापना सोहळा" },
  { key: "aarti", title: "आरती", summary: "दररोजची सकाळ-संध्याकाळ आरती व मंगलमय प्रार्थना" },
  { key: "satyanarayan", title: "सत्यनारायण पूजा", summary: "श्री सत्यनारायण महाराजांची पूजा आणि कथा" },
  { key: "dhol", title: "ढोल पथक व स्पर्धा", summary: "ढोल पथक, विविध मनोरंजनात्मक स्पर्धा आणि Funfair" },
  { key: "mahaprasad", title: "महाप्रसाद", summary: "महाप्रसादाचा नैवेद्य आणि भाविकांसाठी वितरण" },
  { key: "karyakram", title: "विविध कार्यक्रम", summary: "सांस्कृतिक, मनोरंजनात्मक आणि सामाजिक कार्यक्रम" },
  { key: "visarjan", title: "विसर्जन सोहळा", summary: "गणरायाच्या निरोपाचा भावपूर्ण विसर्जन सोहळा" },
];

const makeId = () => Math.random().toString(36).slice(2, 10);

function parseTime12(value?: string) {
  const match = value?.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (match) return { hour: String(parseInt(match[1], 10)), minute: match[2], period: match[3].toUpperCase() };
  return { hour: "7", minute: "00", period: "AM" };
}

function TimePicker12({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const parsed = parseTime12(value);
  const setPart = (part: "hour" | "minute" | "period", v: string) => {
    const next = { ...parsed, [part]: v };
    onChange(`${next.hour.padStart(2, "0")}:${next.minute} ${next.period}`);
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      <select className="input" value={parsed.hour} onChange={(e) => setPart("hour", e.target.value)}>
        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <select className="input" value={parsed.minute} onChange={(e) => setPart("minute", e.target.value)}>
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="input" value={parsed.period} onChange={(e) => setPart("period", e.target.value)}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

export type EditableMandal = {
  mandal_name: string;
  language: "mr" | "hi" | "en";
  invite_message: string;
  established_year: string | null;
  contact: string;
  address: string;
  maps_link: string | null;
  instagram_url: string | null;
  timeline: TimelineDraft[];
  gallery: { url: string; caption?: string }[];
};

export default function EditForm({ token, initial }: { token: string; initial: EditableMandal }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [mandalName, setMandalName] = useState(initial.mandal_name);
  const [language, setLanguage] = useState<"mr" | "hi" | "en">(initial.language);
  const [inviteMessage, setInviteMessage] = useState(initial.invite_message);
  const [establishedYear, setEstablishedYear] = useState(initial.established_year || "");
  const [contact, setContact] = useState(initial.contact);
  const [address, setAddress] = useState(initial.address);
  const [mapsLink, setMapsLink] = useState(initial.maps_link || "");
  const [instagramUrl, setInstagramUrl] = useState(initial.instagram_url || "");

  const [events, setEvents] = useState<TimelineDraft[]>(
    (initial.timeline || []).map((e) => ({ ...e, id: e.id || makeId() }))
  );

  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>(
    (initial.gallery || []).map((g) => ({ url: g.url, caption: g.caption || "" }))
  );
  const [newPhotos, setNewPhotos] = useState<{ file: File; caption: string; preview: string }[]>([]);

  const activePhotoCount = existingPhotos.filter((p) => !p._remove).length + newPhotos.length;

  const updateEvent = (id: string, field: keyof TimelineDraft, value: string) => {
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, [field]: value } : ev)));
  };
  const removeEvent = (id: string) => setEvents((p) => p.filter((ev) => ev.id !== id));
  const addCustomEvent = () =>
    events.length < 10 && setEvents((p) => [...p, { id: makeId(), title: "", summary: "", date: "", time: "" }]);
  const togglePreset = (preset: (typeof PRESET_EVENTS)[number]) => {
    setEvents((prev) => {
      const exists = prev.find((ev) => ev.presetKey === preset.key);
      if (exists) return prev.filter((ev) => ev.presetKey !== preset.key);
      if (prev.length >= 10) return prev;
      return [...prev, { id: makeId(), title: preset.title, summary: preset.summary, date: "", time: "", presetKey: preset.key }];
    });
  };
  const isPresetSelected = (key: string) => events.some((ev) => ev.presetKey === key);

  const toggleRemoveExisting = (url: string) => {
    setExistingPhotos((prev) => prev.map((p) => (p.url === url ? { ...p, _remove: !p._remove } : p)));
  };
  const updateExistingCaption = (url: string, caption: string) => {
    setExistingPhotos((prev) => prev.map((p) => (p.url === url ? { ...p, caption } : p)));
  };
  const handleNewPhotos = (files: FileList | null) => {
    if (!files) return;
    const room = 10 - activePhotoCount;
    const selected = Array.from(files).slice(0, room);
    setNewPhotos((prev) => [
      ...prev,
      ...selected.map((file) => ({ file, caption: "", preview: URL.createObjectURL(file) })),
    ]);
  };
  const removeNewPhoto = (i: number) => setNewPhotos((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setError("");
    if (activePhotoCount < 6) {
      setError("किमान ६ फोटो असणे आवश्यक आहे.");
      return;
    }
    setSaving(true);
    try {
      let uploadedUrls: string[] = [];
      if (newPhotos.length > 0) {
        setProgress("नवीन फोटो अपलोड होत आहेत...");
        uploadedUrls = await uploadPhotos(
          newPhotos.map((p) => p.file),
          "edits",
          (done, total) => setProgress(`फोटो अपलोड होत आहेत... (${done}/${total})`)
        );
      }

      const finalGallery = [
        ...existingPhotos.filter((p) => !p._remove).map((p) => ({ url: p.url, caption: p.caption })),
        ...uploadedUrls.map((url, i) => ({ url, caption: newPhotos[i].caption })),
      ];

      const finalTimeline = events
        .filter((e) => e.title.trim())
        .map((e) =>
          e.presetKey === "aarti"
            ? { title: e.title, summary: e.summary, presetKey: e.presetKey, morningTime: e.morningTime, eveningTime: e.eveningTime }
            : { title: e.title, summary: e.summary, presetKey: e.presetKey, date: e.date, time: e.time }
        );

      setProgress("माहिती जतन होत आहे...");
      const res = await fetch("/api/mandal/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          mandal_name: mandalName,
          language,
          invite_message: inviteMessage,
          established_year: establishedYear,
          contact,
          address,
          maps_link: mapsLink,
          instagram_url: instagramUrl || null,
          timeline: finalTimeline,
          gallery: finalGallery,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "जतन करताना अडचण आली.");

      setSaved(true);
      setNewPhotos([]);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "काहीतरी चुकले, पुन्हा प्रयत्न करा.");
    } finally {
      setSaving(false);
      setProgress("");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-amber-900 text-center">तुमची माहिती संपादित करा</h1>
      <p className="text-amber-600 text-xs text-center mt-1">बदल जतन करताच लगेच live होतील.</p>

      <div className="flex flex-col gap-4 mt-6">
        <Field label="मंडळाचे नाव">
          <input value={mandalName} onChange={(e) => setMandalName(e.target.value)} className="input" />
        </Field>
        <Field label="भाषा">
          <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="input">
            <option value="mr">मराठी</option>
            <option value="hi">हिंदी</option>
            <option value="en">English</option>
          </select>
        </Field>
        <Field label="निमंत्रण संदेश">
          <textarea value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)} className="input" rows={4} />
        </Field>
        <Field label="स्थापना वर्ष">
          <input value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} className="input" />
        </Field>
        <Field label="संपर्क क्रमांक">
          <input value={contact} onChange={(e) => setContact(e.target.value)} className="input" />
        </Field>
        <Field label="पत्ता">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
        </Field>
        <Field label="Google Maps लिंक">
          <input value={mapsLink} onChange={(e) => setMapsLink(e.target.value)} className="input" />
        </Field>
        <Field label="Instagram लिंक">
          <input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="input" />
        </Field>
      </div>

      {/* TIMELINE */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-amber-900 mb-3">कार्यक्रमाची माहिती</h2>
        <div className="flex flex-col gap-2 mb-4">
          {PRESET_EVENTS.map((preset) => {
            const checked = isPresetSelected(preset.key);
            return (
              <label key={preset.key} className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer ${checked ? "border-orange-400 bg-orange-50" : "border-amber-200 bg-white"}`}>
                <input type="checkbox" checked={checked} onChange={() => togglePreset(preset)} className="mt-1 w-4 h-4 accent-orange-500" />
                <span>
                  <span className="block font-medium text-amber-900">{preset.title}</span>
                  <span className="block text-xs text-amber-600 mt-0.5">{preset.summary}</span>
                </span>
              </label>
            );
          })}
        </div>

        {events.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map((ev, i) => (
              <div key={ev.id} className="border border-amber-300 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-800">{i + 1}. {ev.title || "कार्यक्रम"}</span>
                  <button onClick={() => removeEvent(ev.id)} className="text-red-500 text-sm">काढा</button>
                </div>
                {!ev.presetKey && (
                  <>
                    <input placeholder="शीर्षक" value={ev.title} onChange={(e) => updateEvent(ev.id, "title", e.target.value)} className="input" />
                    <input placeholder="थोडक्यात माहिती" value={ev.summary} onChange={(e) => updateEvent(ev.id, "summary", e.target.value)} className="input" />
                  </>
                )}
                {ev.presetKey === "aarti" ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="mb-1.5 text-xs text-amber-700">सकाळची आरती वेळ</p>
                      <TimePicker12 value={ev.morningTime} onChange={(v) => updateEvent(ev.id, "morningTime", v)} />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs text-amber-700">सांयकाळची आरती वेळ</p>
                      <TimePicker12 value={ev.eveningTime} onChange={(v) => updateEvent(ev.id, "eveningTime", v)} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <input type="date" value={ev.date} onChange={(e) => updateEvent(ev.id, "date", e.target.value)} className="input" />
                    <TimePicker12 value={ev.time} onChange={(v) => updateEvent(ev.id, "time", v)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {events.length < 10 && (
          <button onClick={addCustomEvent} className="mt-3 w-full text-amber-700 border border-dashed border-amber-400 rounded-xl py-3">
            + वेगळा कार्यक्रम जोडा
          </button>
        )}
      </div>

      {/* PHOTOS */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-amber-900 mb-1">छायाचित्रे</h2>
        <p className="text-xs text-amber-600 mb-3">किमान ६, कमाल १० — सध्या: {activePhotoCount}/10</p>

        <div className="grid grid-cols-3 gap-3">
          {existingPhotos.map((p) => (
            <div key={p.url} className={`relative ${p._remove ? "opacity-30" : ""}`}>
              <img src={p.url} className="w-full aspect-square object-cover rounded-lg" />
              <button
                onClick={() => toggleRemoveExisting(p.url)}
                className={`absolute top-1 right-1 w-6 h-6 rounded-full text-xs text-white ${p._remove ? "bg-green-600" : "bg-black/60"}`}
              >
                {p._remove ? "↺" : "×"}
              </button>
              {!p._remove && (
                <input
                  placeholder="Caption"
                  value={p.caption}
                  onChange={(e) => updateExistingCaption(p.url, e.target.value)}
                  className="mt-1 w-full text-xs border border-amber-200 rounded px-1 py-1"
                />
              )}
            </div>
          ))}
          {newPhotos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p.preview} className="w-full aspect-square object-cover rounded-lg" />
              <button onClick={() => removeNewPhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs">×</button>
              <span className="mt-1 block text-[10px] text-green-700">नवीन</span>
            </div>
          ))}
        </div>

        {activePhotoCount < 10 && (
          <input type="file" accept="image/*" multiple onChange={(e) => handleNewPhotos(e.target.files)} className="input mt-3" />
        )}
      </div>

      {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
      {progress && <p className="text-amber-700 text-sm text-center mt-4">{progress}</p>}
      {saved && !saving && <p className="text-green-600 text-sm text-center mt-4">✓ जतन झाले — बदल live आहेत.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-orange-500 text-white rounded-full py-3 font-medium disabled:opacity-50"
      >
        {saving ? "जतन होत आहे..." : "बदल जतन करा"}
      </button>

      <style jsx global>{`
        .input {
          border: 1px solid #fcd34d;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-amber-800">{label}</span>
      {children}
    </label>
  );
}