document.addEventListener('DOMContentLoaded', function() {
    // load study.json file
    const studyDataLink = document.querySelector('link[rel="study-data"]').href;
    fetch(studyDataLink)
        .then(response => response.json())
        .then(data => {
            console.log('Loaded study.json:', data);
            if(document.querySelector('.study-detail')) {
                const study_id = window.location.pathname.split('/').pop();
                const study = data.find(study => study.study_id == study_id);
                if(study) {
                    set_study_details(study);
                    const related = data.filter(related_study => related_study.secondary_topic.name == study.secondary_topic.name);
                    related.splice(5);
                    set_study_teasers(related);
                } else {
                    console.error('Study not found:', study_id);
                }
            }
            if(document.querySelector('.study-search')) {
                const search_params = new URLSearchParams(window.location.search);
                const study_search = search_params.get('study_search');
                const publish_year = search_params.get('publish_year');
                const country = search_params.get('country');
                const primary_topic = search_params.get('primary_topic');
                const outcome = search_params.get('outcome');
                const secondary_topic = search_params.get('secondary_topic');
                const tertiary_topic = search_params.get('tertiary_topic');
                const study_author = search_params.get('study_author');
                const application = search_params.get('application');
                const test_subject = search_params.get('test_subject');
                const journal = search_params.get('journal');
                // get all possible values from the data
                const all_publish_years = [...new Set(data.map(study => study.publish_year))];
                all_publish_years.sort((a, b) => b - a);
                const all_countries = [...new Set(data.map(study => study.country))];
                all_countries.sort((a, b) => a.localeCompare(b));
                const all_primary_topics = [...new Set(data.map(study => study.primary_topic.name))];
                all_primary_topics.sort((a, b) => a.localeCompare(b));
                const all_outcomes = [...new Set(data.map(study => study.rank))];
                all_outcomes.sort((a, b) => a.localeCompare(b));
                const all_secondary_topics = [...new Set(data.map(study => study.secondary_topic.name))];
                all_secondary_topics.sort((a, b) => a.localeCompare(b));
                const all_tertiary_topics = [...new Set(data.map(study => study.tertiary_topic ? study.tertiary_topic.name : ''))].filter(topic => topic !== '');
                all_tertiary_topics.sort((a, b) => a.localeCompare(b));
                const all_study_authors = [...new Set(data.flatMap(study => study.authors.map(author => author.name)))];
                all_study_authors.sort((a, b) => a.localeCompare(b));
                const all_applications = [...new Set(data.map(study => study.application))];
                all_applications.sort((a, b) => a.localeCompare(b));
                const all_test_subjects = [...new Set(data.map(study => study.test_subject.name))];
                all_test_subjects.sort((a, b) => a.localeCompare(b));
                const all_journals = [...new Set(data.map(study => study.journal.name))];
                all_journals.sort((a, b) => a.localeCompare(b));
                // populate the filters
                const publish_year_select = document.querySelector('[name="publish_year"]');
                const country_select = document.querySelector('[name="country"]');
                const primary_topic_select = document.querySelector('[name="primary_topic"]');
                const outcome_select = document.querySelector('[name="outcome"]');
                const secondary_topic_select = document.querySelector('[name="secondary_topic"]');
                const tertiary_topic_select = document.querySelector('[name="tertiary_topic"]');
                const study_author_select = document.querySelector('[name="study_author"]');
                const application_select = document.querySelector('[name="application"]');
                const test_subject_select = document.querySelector('[name="test_subject"]');
                const journal_select = document.querySelector('[name="journal"]');
                for(let year of all_publish_years) {
                    const option = document.createElement('option');
                    option.value = year;
                    option.innerText = year;
                    publish_year_select.appendChild(option);
                }
                for(let country of all_countries) {
                    const option = document.createElement('option');
                    option.value = country;
                    option.innerText = country;
                    country_select.appendChild(option);
                }
                for(let topic of all_primary_topics) {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.innerText = topic;
                    primary_topic_select.appendChild(option);
                }
                for(let outcome of all_outcomes) {
                    const option = document.createElement('option');
                    option.value = outcome;
                    option.innerText = outcome;
                    outcome_select.appendChild(option);
                }
                for(let topic of all_secondary_topics) {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.innerText = topic;
                    secondary_topic_select.appendChild(option);
                }
                for(let topic of all_tertiary_topics) {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.innerText = topic;
                    tertiary_topic_select.appendChild(option);
                }
                for(let author of all_study_authors) {
                    const option = document.createElement('option');
                    option.value = author;
                    option.innerText = author;
                    study_author_select.appendChild(option);
                }
                for(let application of all_applications) {
                    const option = document.createElement('option');
                    option.value = application;
                    option.innerText = application;
                    application_select.appendChild(option);
                }
                for(let subject of all_test_subjects) {
                    const option = document.createElement('option');
                    option.value = subject;
                    option.innerText = subject;
                    test_subject_select.appendChild(option);
                }
                for(let journal of all_journals) {
                    const option = document.createElement('option');
                    option.value = journal;
                    option.innerText = journal;
                    journal_select.appendChild(option);
                }
                // set the filters to the selected values
                if(publish_year) {
                    publish_year_select.value = publish_year;
                }
                if(country) {
                    country_select.value = country;
                }
                if(primary_topic) {
                    primary_topic_select.value = primary_topic;
                }
                if(outcome) {
                    outcome_select.value = outcome;
                }
                if(secondary_topic) {
                    secondary_topic_select.value = secondary_topic;
                }
                if(tertiary_topic) {
                    tertiary_topic_select.value = tertiary_topic;
                }
                if(study_author) {
                    study_author_select.value = study_author;
                }
                if(application) {
                    application_select.value = application;
                }
                if(test_subject) {
                    test_subject_select.value = test_subject;
                }
                if(journal) {
                    journal_select.value = journal;
                }
                // set the search query to the input value
                const search_input = document.querySelector('[name="study_search"]');
                if(search_input) {
                    search_input.value = study_search;
                }
                if(document.querySelector('.shopify-section--study-search')) {
                    let search_results = data;
                    if(study_search) {
                        const search_query = study_search.toLocaleLowerCase();
                        search_results = search_results.filter(study => {
                            return study.title.toLowerCase().includes(search_query)
                            || study.abstract.toLowerCase().includes(search_query)
                        });
                    }
                    if(publish_year) {
                        search_results = search_results.filter(study => study.publish_year == publish_year);
                    }
                    if(country) {
                        search_results = search_results.filter(study => study.country == country);
                    }
                    if(primary_topic) {
                        search_results = search_results.filter(study => study.primary_topic.name == primary_topic);
                    }
                    if(outcome) {
                        search_results = search_results.filter(study => study.rank == outcome);
                    }
                    if(secondary_topic) {
                        search_results = search_results.filter(study => study.secondary_topic.name == secondary_topic);
                    }
                    if(tertiary_topic) {
                        search_results = search_results.filter(study => study.tertiary_topic?.name == tertiary_topic);
                    }
                    if(study_author) {
                        search_results = search_results.filter(study => study.authors.some(author => author.name == study_author));
                    }
                    if(application) {
                        search_results = search_results.filter(study => study.application == application);
                    }
                    if(test_subject) {
                        search_results = search_results.filter(study => study.test_subject.name == test_subject);
                    }
                    if(journal) {
                        search_results = search_results.filter(study => study.journal.name == journal);
                    }
                    document.querySelector('.study-count').innerText = search_results.length;
                    set_study_teasers(search_results);
                }
            }
        })
        .catch(error => {
            console.error('Error loading study.json:', error);
        });

    function set_study_teasers(search_results) {
        const teaser_section = document.querySelector('.study-teasers');
        teaser_section.innerHTML = '';

        if (search_results.length === 0) {
            const no_results = document.createElement('p');
            no_results.innerText = 'No studies found.';
            teaser_section.appendChild(no_results);
            return;
        }

        const results_per_page = 10;
        let current_page = 1;

        function render_page(page) {
            teaser_section.innerHTML = '';
            const start_index = (page - 1) * results_per_page;
            const end_index = start_index + results_per_page;
            const page_results = search_results.slice(start_index, end_index);

            for (let teaser of page_results) {
                const article = document.createElement('article');
                article.className = 'study';
                const link = document.createElement('a');
                const headline = document.createElement('h2');
                const meta = document.createElement('p');
                link.href = '/pages/study-detail/' + teaser.study_id;
                headline.className = 'entry-title study-headline';
                headline.innerText = teaser.title;
                meta.className = 'post-meta';
                const publish_year = document.createElement('span');
                publish_year.className = 'study-published';
                publish_year.innerText = teaser.publish_year;
                meta.appendChild(publish_year);
                const outcome = document.createElement('span');
                outcome.className = 'study-outcome';
                outcome.innerText = teaser.rank;
                meta.appendChild(outcome);
                const primary_topic = document.createElement('span');
                primary_topic.className = 'study-topic';
                primary_topic.innerText = teaser.primary_topic.name;
                meta.appendChild(primary_topic);
                const secondary_topic = document.createElement('span');
                secondary_topic.className = 'study-topic';
                secondary_topic.innerText = teaser.secondary_topic.name;
                meta.appendChild(secondary_topic);
                if (teaser.tertiary_topic) {
                    const tertiary_topic = document.createElement('span');
                    tertiary_topic.className = 'study-topic';
                    tertiary_topic.innerText = teaser.tertiary_topic.name;
                    meta.appendChild(tertiary_topic);
                }
                article.appendChild(link);
                link.appendChild(headline);
                link.appendChild(meta);
                teaser_section.appendChild(article);
                // truncate the abstract to 200 characters
                const abstract = document.createElement('p');
                abstract.innerText = teaser.abstract.length > 270 ? teaser.abstract.substring(0, 270) + '...' : teaser.abstract;
                link.appendChild(abstract);
            }

            render_pagination();
        }

        function render_pagination() {
            let pagination_section = document.querySelector('.teaser-pagination');
            if (!pagination_section) {
                pagination_section = document.createElement('div');
                pagination_section.className = 'teaser-pagination';
                teaser_section.parentNode.appendChild(pagination_section);
            } else {
                pagination_section.innerHTML = '';
            }

            const total_pages = Math.ceil(search_results.length / results_per_page);

            let limit_from_start = 5;
            let limit_from_end = 5;
            let limit_from_curret = 3;
            for (let i = 1; i <= total_pages; i++) {
                if (i <= limit_from_start || i > total_pages - limit_from_end || (i >= current_page - limit_from_curret && i <= current_page + limit_from_curret)) {
                    const page_button = document.createElement('button');
                    page_button.innerText = i;
                    page_button.className = i === current_page ? 'button active' : 'button';
                    page_button.addEventListener('click', () => {
                        current_page = i;
                        render_page(current_page);
                    });
                    pagination_section.appendChild(page_button);
                } else if (i === limit_from_start + 1 || i === total_pages - limit_from_end) {
                    const ellipsis = document.createElement('span');
                    ellipsis.innerText = '...';
                    pagination_section.appendChild(ellipsis);
                }
            }
        }

        render_page(current_page);
    }

    function set_study_details(study) {
        document.querySelector('.study-count').innerText = 1;
        const detail_section = document.querySelector('.study-detail');
        detail_section.innerHTML = '';
        const detail_headline = document.createElement('h1');
        detail_headline.className = 'entry-title study-headline';
        detail_headline.innerText = study.title;
        detail_section.appendChild(detail_headline);
        const detail_meta = document.createElement('div');
        detail_meta.className = 'entry-meta';
        const detail_content = document.createElement('div');
        detail_content.className = 'entry-content';
        const detail_published = document.createElement('span');
        detail_published.className = 'study-published';
        detail_published.innerText = study.publish_year;
        detail_meta.appendChild(detail_published);
        const detail_outcome = document.createElement('span');
        detail_outcome.className = 'study-outcome';
        detail_outcome.innerText = study.rank;
        detail_meta.appendChild(detail_outcome);
        const detail_country = document.createElement('span');
        detail_country.className = 'study-country';
        detail_country.innerText = study.country;
        detail_meta.appendChild(detail_country);
        for(let author of study.authors) {
            const span = document.createElement('span');
            span.className = 'study-author';
            span.innerText = author.name;
            detail_meta.appendChild(span);
        }
        const detail_test_subject = document.createElement('span');
        detail_test_subject.className = 'study-testsubject';
        detail_test_subject.innerText = study.test_subject.name;
        detail_meta.appendChild(detail_test_subject);
        const detail_journal = document.createElement('span');
        detail_journal.className = 'study-journal';
        detail_journal.innerText = study.journal.name;
        detail_meta.appendChild(detail_journal);
        const detail_application = document.createElement('span');
        detail_application.className = 'study-application';
        detail_application.innerText = study.application;
        detail_meta.appendChild(detail_application);
        const primary_topic = document.createElement('span');
        primary_topic.className = 'study-topic';
        primary_topic.innerText = study.primary_topic.name;
        detail_meta.appendChild(primary_topic);
        const secondary_topic = document.createElement('span');
        secondary_topic.className = 'study-topic';
        secondary_topic.innerText = study.secondary_topic.name;
        detail_meta.appendChild(secondary_topic);
        if(study.tertiary_topic){
            const tertiary_topic = document.createElement('span');
            tertiary_topic.className = 'study-topic';
            tertiary_topic.innerText = study.tertiary_topic.name;
            detail_meta.appendChild(tertiary_topic);
        }
        if(study.vehicle){
            const detail_vehicle = document.createElement('span');
            detail_vehicle.className = 'study-vehicle';
            detail_vehicle.innerText = study.vehicle;
            detail_meta.appendChild(detail_vehicle);
        }
        if(study.comparison){
            const detail_comparison = document.createElement('span');
            detail_comparison.className = 'study-comparison';
            detail_comparison.innerText = study.comparison;
            detail_meta.appendChild(detail_comparison);
        }
        if(study.complement){
            const detail_complement = document.createElement('span');
            detail_complement.className = 'study-complement';
            detail_complement.innerText = study.complement;
            detail_meta.appendChild(detail_complement);
        }
        detail_section.appendChild(detail_meta);
        const detail_description = document.createElement('p');
        detail_description.innerText = study.abstract;
        detail_content.appendChild(detail_description);
        const read_more = document.createElement('p');
        read_more.innerText = 'Read more: ';
        const detail_doi = document.createElement('a');
        detail_doi.innerText = study.doi;
        detail_doi.href = study.doi;
        detail_doi.target = '_blank';
        detail_doi.rel = 'noopener';
        read_more.appendChild(detail_doi);
        detail_content.appendChild(read_more);
        detail_section.appendChild(detail_content);
    }
});