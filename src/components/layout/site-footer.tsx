import { SITE_CONFIG } from "@/configs/site"

const SiteFooter = () => {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container-wrapper">
                <div className="container py-4">
                    <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                            href={SITE_CONFIG.links.profile}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            UDU_S4U
                        </a>
                        . Still in development.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default SiteFooter