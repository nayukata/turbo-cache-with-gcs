import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4" style={{backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', padding: '16px', marginBottom: '16px'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', color: '#92400e', marginBottom: '8px'}}>
            🧪 プラットフォーム固有キャッシュテスト
          </h2>
          <p style={{color: '#b45309', marginBottom: '12px'}}>
            このアプリケーションはSharp（ネイティブバイナリ）を含んでおり、異なるプラットフォーム間でのTurborepoキャッシュの動作をテストできます。
          </p>
          <Link 
            href="/image-processing"
            style={{display: 'inline-block', backgroundColor: '#d97706', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none'}}
          >
            Sharp処理をテスト →
          </Link>
        </div>

        <ol>
          <li>
            <code>apps/web/app/page.tsx</code>を編集して開始
          </li>
          <li>保存すると変更が即座に反映されます</li>
          <li>
            <Link href="/image-processing" style={{color: '#2563eb', textDecoration: 'underline'}}>
              /image-processing
            </Link>
            {" "}にアクセスしてネイティブバイナリをテスト
          </li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turborepo.com/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <Button appName="web" className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          サンプル
        </a>
        <a
          href="/image-processing"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Sharpテストページ →
        </a>
      </footer>
    </div>
  );
}
