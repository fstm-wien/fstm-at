import type { Schema, Struct } from "@strapi/strapi";

export interface SharedAnnouncement extends Struct.ComponentSchema {
    collectionName: "components_shared_announcements";
    info: {
        displayName: "Announcement";
        icon: "bell";
    };
    attributes: {
        content: Schema.Attribute.RichText;
        identifier: Schema.Attribute.String & Schema.Attribute.Required;
    };
}

export interface SharedFooterLinks extends Struct.ComponentSchema {
    collectionName: "components_shared_footer_links";
    info: {
        displayName: "Footer Links";
        icon: "link";
    };
    attributes: {
        faIcon: Schema.Attribute.String;
        target: Schema.Attribute.String & Schema.Attribute.Required;
    };
}

export interface SharedGridItems extends Struct.ComponentSchema {
    collectionName: "components_shared_grid_items";
    info: {
        displayName: "Grid Items";
        icon: "apps";
    };
    attributes: {
        color: Schema.Attribute.String;
        content: Schema.Attribute.RichText;
        faIcon: Schema.Attribute.String;
        target: Schema.Attribute.String;
        title: Schema.Attribute.String & Schema.Attribute.Required;
    };
}

export interface SharedMedia extends Struct.ComponentSchema {
    collectionName: "components_shared_media";
    info: {
        displayName: "Media";
        icon: "file-video";
    };
    attributes: {
        file: Schema.Attribute.Media<"images" | "files" | "videos">;
    };
}

export interface SharedNavbarItem extends Struct.ComponentSchema {
    collectionName: "components_shared_navbar_items";
    info: {
        displayName: "NavbarItem";
        icon: "code";
    };
    attributes: {
        href: Schema.Attribute.String;
        label: Schema.Attribute.String;
    };
}

export interface SharedQuote extends Struct.ComponentSchema {
    collectionName: "components_shared_quotes";
    info: {
        displayName: "Quote";
        icon: "indent";
    };
    attributes: {
        body: Schema.Attribute.Text;
        title: Schema.Attribute.String;
    };
}

export interface SharedRichText extends Struct.ComponentSchema {
    collectionName: "components_shared_rich_texts";
    info: {
        description: "";
        displayName: "Rich text";
        icon: "align-justify";
    };
    attributes: {
        body: Schema.Attribute.RichText;
    };
}

export interface SharedSeo extends Struct.ComponentSchema {
    collectionName: "components_shared_seos";
    info: {
        description: "";
        displayName: "Seo";
        icon: "allergies";
        name: "Seo";
    };
    attributes: {
        metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
        metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
        shareImage: Schema.Attribute.Media<"images">;
    };
}

export interface SharedSlider extends Struct.ComponentSchema {
    collectionName: "components_shared_sliders";
    info: {
        description: "";
        displayName: "Slider";
        icon: "address-book";
    };
    attributes: {
        files: Schema.Attribute.Media<"images", true>;
    };
}

declare module "@strapi/strapi" {
    export module Public {
        export interface ComponentSchemas {
            "shared.announcement": SharedAnnouncement;
            "shared.footer-links": SharedFooterLinks;
            "shared.grid-items": SharedGridItems;
            "shared.media": SharedMedia;
            "shared.navbar-item": SharedNavbarItem;
            "shared.quote": SharedQuote;
            "shared.rich-text": SharedRichText;
            "shared.seo": SharedSeo;
            "shared.slider": SharedSlider;
        }
    }
}
