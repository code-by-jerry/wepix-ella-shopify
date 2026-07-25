$jsonPath = "c:\Jerry\shopify\ella-theme\sections\header-group.json"
$json = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json

$announcementBar = $json.sections.announcement_bar_4tGfEp
$groupBar = $announcementBar.blocks.group_announcement_bar_PeTpTw
$groupAnn = $groupBar.blocks.group_announcement_9yj6cq

# Update settings
$groupAnn.settings.autoplay = $true
$groupAnn.settings.autoplay_speed = 5
$groupAnn.settings.inherit_color_scheme = $false
$groupAnn.settings.scheme_background = "#212326"
$groupAnn.settings.scheme_foreground_heading = "#ffffff"
$groupAnn.settings.scheme_foreground = "#ffffff"
$groupAnn.settings.scheme_primary = "#ffffff"
$groupAnn.settings.scheme_primary_hover = "#ffffff"
$groupAnn.settings.scheme_border = "#212326"
$groupAnn.settings.scheme_shadow = "#212326"

# Update height via padding
$announcementBar.settings.padding_top = 11
$announcementBar.settings.padding_bottom = 11

# Rebuild blocks
$groupAnn.blocks = @{
    "announcement_1" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "<a href='/collections/topwear' style='text-decoration:none; color:#FFFFFF;'>Buy 2, Save ₹200 | Buy 3, Save ₹500</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
    "announcement_2" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "<a href='/collections/buy-2-1499' style='text-decoration:none; color:#FFFFFF;'>Buy 2 Kurtas For ₹1499</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
    "announcement_3" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "<a href='/collections/dresses' style='text-decoration:none; color:#FFFFFF;'>FREE shipping on all orders above Rs.1500</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
    "announcement_4" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "<a href='/collections/new-arrivals' style='text-decoration:none; color:#FFFFFF;'>Same day Dispatch</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
    "announcement_5" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "Get flat 10% off on your app purchase. Use code: APP10 | <a href='https://hayclothing.page.link/DSF9' style='text-decoration:none; color:#FFFFFF;'>DOWNLOAD NOW</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
    "announcement_6" = @{
        "type" = "_announcement-text"
        "settings" = @{
            "text" = "<a href='/collections/new-arrivals' style='text-decoration:none; color:#FFFFFF;'>New Arrivals updated every Thursday</a>"
            "font" = "body"
            "font_size" = "1.4rem"
        }
        "blocks" = @{}
    }
}
$groupAnn.block_order = @("announcement_1", "announcement_2", "announcement_3", "announcement_4", "announcement_5", "announcement_6")

$json | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath
