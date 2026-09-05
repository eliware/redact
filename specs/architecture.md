# Architecture

Production modules live under `src/`, and tests mirror the source hierarchy
under `tests/`. Each module has one cohesive responsibility. Public exports are
defined only by `src/index.mjs`; internal modules are not part of the package
contract unless explicitly exported.
