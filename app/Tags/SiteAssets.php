<?php

namespace App\Tags;

use Illuminate\Foundation\Vite;
use Statamic\Tags\Tags;

class SiteAssets extends Tags
{
    /**
     * Load site assets through Vite during development and inline the production
     * stylesheet so it cannot block the first render.
     */
    public function index(): string
    {
        $vite = clone app(Vite::class);

        if ($vite->isRunningHot()) {
            return $vite->withEntryPoints([
                'resources/css/styles.css',
                'resources/js/site.js',
            ])->toHtml();
        }

        return sprintf(
            "<style>%s</style>\n%s",
            $vite->content('resources/css/styles.css'),
            $vite->withEntryPoints(['resources/js/site.js'])->toHtml(),
        );
    }
}
