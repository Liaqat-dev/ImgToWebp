const qualitySlider = document.getElementById("qualitySlider");
const qualityValue = document.getElementById("qualityValue");
const effortSlider = document.getElementById("effortSlider");
const effortValue = document.getElementById("effortValue");
const statusText = document.getElementById("statusText");

qualitySlider.oninput = () => qualityValue.textContent = qualitySlider.value;
effortSlider.oninput = () => effortValue.textContent = effortSlider.value;

document.getElementById("converterForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    statusText.textContent = "Converting...";

    const formData = new FormData(e.target);
    try {
        const res = await fetch("/convert", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Conversion failed");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${Date.now()}.webp`
        a.click();
        URL.revokeObjectURL(url);
        statusText.textContent = "Download ready!";
    } catch (err) {
        console.error(err);
        statusText.textContent = "Conversion failed.";
    }
});
