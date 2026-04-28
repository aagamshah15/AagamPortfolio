(function () {
  var body = document.body;
  var yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  body.classList.remove('theme-light');
  try {
    localStorage.removeItem('aagam-theme');
  } catch (error) {
    // Ignore storage access issues and keep the default dark theme.
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var repoContainer = document.getElementById('github-projects');
  if (repoContainer) {
    fetch('https://api.github.com/users/aagamshah15/repos?per_page=100&sort=updated')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API unavailable');
        return res.json();
      })
      .then(function (repos) {
        var list = repos
          .filter(function (repo) { return !repo.fork; })
          .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
          .slice(0, 6);

        if (!list.length) {
          repoContainer.innerHTML = '<p class="repo-loading">No public repositories found right now.</p>';
          return;
        }

        repoContainer.innerHTML = list.map(function (repo) {
          var updated = new Date(repo.pushed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          var safeName = escapeHtml(repo.name);
          var safeDesc = escapeHtml(repo.description || 'Repository for analytics, tooling, or product experiments.');
          var safeUrl = escapeHtml(repo.html_url);
          var safeLang = escapeHtml(repo.language || 'Code');
          return (
            '<article class="repo-card">' +
              '<h4><a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + safeName + '</a></h4>' +
              '<p>' + safeDesc + '</p>' +
              '<div class="repo-meta">' +
                '<span>' + safeLang + '</span> | ' +
                '<span>Updated ' + updated + '</span>' +
              '</div>' +
            '</article>'
          );
        }).join('');

        var repoCards = repoContainer.querySelectorAll('.repo-card');
        repoCards.forEach(function (card) {
          card.classList.add('is-visible');
        });
      })
      .catch(function () {
        repoContainer.innerHTML =
          '<p class="repo-loading">Could not load GitHub projects live. ' +
          '<a href="https://github.com/aagamshah15?tab=repositories" target="_blank" rel="noopener noreferrer">View them on GitHub</a>.</p>';
      });
  }

})();
