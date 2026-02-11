use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectLoadedEventParameters<'a> {
  pub path: &'a str,
  pub size: usize
}