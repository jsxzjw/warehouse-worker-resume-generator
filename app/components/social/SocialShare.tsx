// 依赖：React

export interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  darkMode?: boolean;
}

export function SocialShare({ url, title, description, darkMode = false }: SocialShareProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "Warehouse Worker Resume Generator - Create Professional Resumes in Seconds";
  const shareDescription = description || "Create ATS-optimized resumes for warehouse workers with our AI-powered builder.";

  const platforms = [
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0 1.853 1.055 3.037 1.852 3.037 1.853v5.55H9.809c-1.028 0-1.516-.544-1.516-1.654v-6.058c0-1.11.488-1.516-1.654-1.516-1.654 0-1.028.488-1.516 1.516v5.558h-3.554c-.598 0-.929-.548-1.114-1.218C4.628 16.483 4 14.844 4 13.022c0-1.822.628-3.461 1.625-5.125V7.74c0-1.11.488-1.516-1.654-1.516-1.654 0-1.028.488-1.516 1.516v7.74h-3.554c-.598 0-.929-.548-1.114-1.218C4.628 16.483 4 14.844 4 13.022c0-1.822.628-3.461 1.625-5.125 1.625-1.428 0-2.618.675-3.571 1.853-3.571 1.853v5.569h-3.554v-5.569c0-1.11.488-1.516-1.654-1.516-1.654z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "bg-[#0077b5] hover:bg-[#006399]"
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-5.373 12-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v8.385H6.258v-8.385h-3.847V5.206h3.847v5.75c0 3.795-2.018 5.821-4.984 5.821-1.058 0-2.035-.344-2.687-1.012l-2.22-1.812c-.853-.682-1.987-1.654-1.987-1.654-.706 0-1.273.567-1.273 1.273v3.756h-3.258v8.385h3.847v-8.385h3.847z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(shareTitle)}`,
      color: "bg-[#1877f2] hover:bg-[#0d65c2]"
    },
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 01-2.005.817 4.958 4.958 0 01-2.24.55 10 10 0 012.647-7.575c0 0 5.424 3.61 6.7 6.757 5.532 5.532 5.532 10.007-4.837 10.007-10.025 0-.662-.07-1.325-.17-1.975 2.74 1.787 5.482 3.467 7.247 4.667a10.014 10.014 0 01-4.192 4.735c.07.812.182 1.025.33 1.227.182.182.012 0 .01.007 0 .013 0 .015a.085.085 0 00.01.007.012.014.015.015a1.078 1.078 0 01-.165.015 1.462 1.462 0 01-.138.2c-.233.32-.52.62-.795 1.025a2.36 2.36 0 01-.515.657 3.91 3.91 0 01-.027 5.147c.17.325.33.66.487 1.025.487.425 0 .825-.17 1.135-.42.295-.285.295-.592.592-.92.925a2.36 2.36 0 01-.515-.657 3.91 3.91 0 01-.027-5.147 9.95 9.95 0 014.562-2.595 10.001-10.025 10.001-5.532 0-10.001-4.468-10.001-10 0-.05.002-.1-.004-.15-.007a10.014 10.014 0 014.192-4.735c.07.812.182 1.025.33 1.227.182.182.012 0 .01.007 0 .013 0 .015a.085.085 0 00.01.007.012.014.015.015 1.078 1.078 0 00.166.015c.33-.33.665-.66.975-1.025.09-.083-.165-.167-.165-.25-.25-1.47-1.472-2.775-3.55-2.775-3.55 0-2.627 1.62-4.99 3.925-5.435 5.25-.507 10.507-5.175 10.507-10.147 0-5.532-4.468-10-10-10z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: "bg-[#1da1f2] hover:bg-[#0c85d0]"
    },
    {
      name: "Copy Link",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: "copy"
    }
  ];

  const handleShare = (platform: typeof platforms[0]) => {
    if (platform.action === "copy") {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } else {
      window.open(platform.url, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
        Share:
      </span>
      <div className="flex gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`p-2 rounded-lg transition-all duration-200 ${platform.color} text-white hover:scale-110 active:scale-95`}
            title={platform.name}
          >
            {platform.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
