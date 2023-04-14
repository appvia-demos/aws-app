This simple app allows demonstrating the use of a cloud resource from a Wayfinder application.

To use, apply the cloud resource plan to your instance of Wayfinder:

```
wf apply -f ./.wayfinder/cloudresourceplan.yaml
```

Then in your workspace, apply the app:

```
wf use workspace proj1
wf apply -f ./.wayfinder/app.yaml
```

Create an app environment as needed then deploy, setting CLUSTERNAME to an existing cluster (or
tweak to use a plan instead and create a new cluster):

```
wf create appenv --app testapp -c CLUSTERNAME -e test -s nonprod
wf deploy component testapp test --component store --wait-for-ready 2m
wf deploy component testapp test --component test --wait-for-ready 3m
```
